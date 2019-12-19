// @flow
import _ from 'lodash';
import Contestant from "./contestant";
import type { Ability, Unit } from "./index";
import { DARK, FIRE, LIGHT, WATER, WIND } from "./index";

const ElementAdvantage = {
    [FIRE]: WIND,
    [WIND]: WATER,
    [WATER]: FIRE,
    [LIGHT]: DARK,
    [DARK]: LIGHT,
};

export const Elements = {
    hasAdvantage(attacker: Contestant, victim: Contestant) {
        return ElementAdvantage[attacker.element] === victim.element;
    },
    hasDisadvantage(attacker: Contestant, victim: Contestant) {
        return ElementAdvantage[victim.element] === attacker.element;
    },
};

type Targeter = (string, Contestant[]) => Unit[];
type BattleMechanic = (Contestant, Contestant, SkillMultipliers, HitContext) => HitContext;
type SkillStep = (Contestant, Contestant, SkillMultipliers) => void;

export function targetEnemy(targetId:string, units: Contestant[]): Contestant[] {
    return units.filter(u => u.id === targetId);
}

type SkillSpec = {
    target: Targeter,
    action: SkillStep[],
    meta: SkillMeta,
}

type SkillCooldown = {
    cooldown: number,
}

type SkillMultipliers = {
    dmg: number,
    effect: number,
}

type SkillMeta = SkillMultipliers & SkillCooldown

function defaultRng(): number {
    return _.random(1, 100);
}

type rng = () => number;

function statOf(u: Contestant, stat: string): number {
    return u[stat] + u[stat] * u.effects.affecting(stat)
        .reduce((rate: number, modifier: number) => rate + modifier, 0);
}

function chanceOf(u: Contestant, stat: string): number {
    return u[stat] + u.effects.affecting(stat)
        .reduce((rate: number, modifier: number) => rate + modifier, 0);
}

function atkOf(u: Contestant): number {
    return statOf(u, 'atk');
}

function defOf(u: Contestant): number {
    return statOf(u, 'def');
}

function glanceChanceOf(u: Contestant): number {
    return chanceOf(u, 'gr');
}

function critChanceOf(u: Contestant): number {
    return chanceOf(u, 'cr');
}

function antiCritChanceOf(u: Contestant): number {
    return chanceOf(u, 'antiCr');
}

type HitContext = {
    dmg?: number,
    isCrit?: boolean,
    isGlance?: boolean,
    effects?: Object[],
}

function elementAdvMod(caster: Contestant, target: Contestant): number {
    return Elements.hasAdvantage(caster, target) ? 15 : 0;
}

function randomDmgMultiplier(rng) {
    return 1 + (Math.floor(rng() / 100) - 2) / 100;
}

function dmgReducton(u: Contestant): number {
    // todo: might need a caster too, for conditional reduction, eg 50% less from fire for fire pony or wind serpent
    return 1000 / (1140 + 3.5 * defOf(u));
}

function glancedDmg(rawDmg: number, caster: Contestant, target: Contestant): number {
    return rawDmg - rawDmg * 0.3 - (Elements.hasDisadvantage(caster, target) ? rawDmg * 0.16 : 0);
}

function critDmg(rawDmg: number, multipliers: SkillMultipliers, cd: number) {
    return rawDmg * (100 + multipliers.dmg + cd) / 100;
}

function crashedDmg(rawDmg: number, multipliers: SkillMultipliers) {
    return rawDmg * (100 + multipliers.dmg + 30) / 100;
}

function normalDmg(rawDmg: number, multipliers: SkillMultipliers) {
    return rawDmg * (100 + multipliers.dmg) / 100;
}

type atkMultiplier = (number) => number;

function someMultiplier(atk) {
    return atk * 3.3 + 35;
}

export function simpleAtkDmg(roll: rng, multiply: atkMultiplier = someMultiplier): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        const rawDmg = multiply(atkOf(caster));

        const advMod = elementAdvMod(caster, target);
        const glancingChance = glanceChanceOf(caster) + advMod;
        const critChance = critChanceOf(caster) - antiCritChanceOf(target) + advMod;
        let isCrit = false, isGlance = false, isCrush = false, dmg;

        const n = roll();
        if (n <= glancingChance) { // glance
            isGlance = true;
            dmg = glancedDmg(rawDmg, caster, target);
        } else if (n <= critChance) { // crit
            isCrit = true;
            dmg = critDmg(rawDmg, multipliers, caster.cd) * dmgReducton(target) * randomDmgMultiplier(roll);
        } else if (n <= advMod) { // crush
            isCrush = true;
            dmg = crashedDmg(rawDmg, multipliers) * dmgReducton(target) * randomDmgMultiplier(roll);
        } else { // normal
            dmg =  normalDmg(rawDmg, multipliers);
        }

        return {
            ...ctx,
            isCrit,
            isGlance,
            isCrush,
            dmg: dmg * dmgReducton(target) * randomDmgMultiplier(roll),
        }
    }
}

export function step(...mechanics: BattleMechanic[]): SkillStep {
    return (caster: Contestant, target: Contestant, meta: SkillMultipliers) => {
        const hit: HitContext = mechanics.reduce((ctx: HitContext, m: BattleMechanic) => {
            return m(caster, target, meta, ctx);
        }, {});

        if (hit.dmg) target.dmg(hit.dmg);
        if (hit.effects) target.affect(hit.effects);
    }
}

const dummySkill: SkillSpec = {
    target: targetEnemy,
    action: [
        step(
            simpleAtkDmg(defaultRng),
        ),
    ],
    meta: {
        dmg: 0.3,
        effect: 0.35,
        cooldown: 0,
    }
};

export const GenericSkills: Map<number, SkillSpec> = new Map([
    [1, dummySkill],
]);

function multistep(steps: SkillStep[]): SkillStep {
    return (caster: Contestant, target: Contestant, meta: SkillMultipliers) => {
        steps.forEach((m) => m(caster, target, meta));
    }
}

export class GenericSkill implements Ability {
    id: number;
    multipliers: SkillMultipliers;
    target: Targeter;
    apply: SkillStep;
    cooldown: number = 0;
    maxCooldown: number;

    constructor(id: number, meta: SkillMeta, target: Targeter, apply: SkillStep) {
        this.id = id;
        const { cooldown, ...multipliers } = meta;
        this.multipliers = multipliers;
        this.maxCooldown = cooldown;
        this.target = target;
        this.apply = apply;
    }

    cast(caster: Contestant, target: string, units: Contestant[]): void {
        this.target(target, units).forEach(t => this.apply(caster, t, this.multipliers));
        this.cooldown = this.maxCooldown;
    }

    refresh(turns: number): void {
        if (turns > 0) {
            this.cooldown = Math.max(0, this.cooldown - turns);
        } else {
            this.cooldown = 0;
        }
    }
}


export function GetSkill(id: number): Ability {
    let spec: ?SkillSpec = GenericSkills.get(id);
    if (spec) {
        return new GenericSkill(
            id,
            spec.meta,
            spec.target,
            multistep(spec.action),
        );
    }

    throw new Error(`Unknown skill: ${id}`)
}
