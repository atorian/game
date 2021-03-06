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

type Targeter = (Contestant, string, Contestant[]) => Unit[];
type BattleMechanic = (Contestant, Contestant, SkillMultipliers, HitContext) => HitContext;
type SkillStep = (Contestant, string, Contestant[], SkillMultipliers) => void;


type SkillSpec = {
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
    isCrush?: boolean,
    effectsAdded: Object[],
    effectsRemoved: Object[],
    resisted: Object[],
}

function elementAdvMod(caster: Contestant, target: Contestant): number {
    return Elements.hasAdvantage(caster, target) ? 15 : 0;
}

function randomDmgMultiplier(rng) {
    return 1 + (Math.floor(rng() / 10) - 2) / 100;
}

function dmgReducton(u: Contestant): number {
    // todo: might need a caster too, for conditional reduction, eg 50% less from fire for fire pony or wind serpent
    return 1000 / (1140 + 3.5 * defOf(u));
}

function glancedDmg(rawDmg: number, caster: Contestant, target: Contestant): number {
    return rawDmg - rawDmg * 0.3 - (Elements.hasDisadvantage(caster, target) ? rawDmg * 0.16 : 0);
}

function critDmg(rawDmg: number, multipliers: SkillMultipliers, cd: number): number {
    let multiplier = (100 + multipliers.dmg + cd) / 100;
    console.log(rawDmg, multiplier, rawDmg * multiplier);
    return rawDmg * multiplier;
}

function crashedDmg(rawDmg: number, multipliers: SkillMultipliers): number {
    return rawDmg * (100 + multipliers.dmg + 30) / 100;
}

function normalDmg(rawDmg: number, multipliers: SkillMultipliers): number {
    return rawDmg * (100 + multipliers.dmg) / 100;
}

type atkMultiplier = (number) => number;


type dmgMultiplier = (attacker: Contestant, target: Contestant) => number;


function someMultiplier(atk) {
    return atk * 3.3 + 35;
}

export function debuff(roll: rng, effectName: string, duration: number, baseChance: number = 100): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        const activationChance = baseChance + multipliers.effect;
        if (!ctx.isGlance && roll() <= activationChance) {
            if (roll() > Math.max(15, target.res - caster.acc)) {
                ctx.effectsAdded.push({ name: effectName, duration: 1 * duration });
            } else {
                ctx.resisted.push({ name: effectName });
            }
        }
        return ctx;
    }
}




export function buff(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function atbDecrease(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}
export function atbIncrease(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function additionalTurn(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}
export function groupAttack(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function strip(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function skillRefresh(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function heal(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function simpleDmgWithoutDmgReduction(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function simpleDmgWithDefIgnore(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function onKill(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function fixedDmg(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function cleanse(): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        // fixme
        return ctx;
    }
}

export function simpleAtkDmg(roll: rng, multiply: atkMultiplier = someMultiplier): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        const rawDmg = multiply(atkOf(caster));
        const advMod = elementAdvMod(caster, target);
        const glancingChance = glanceChanceOf(caster) + advMod;
        const hasAdvantage = Elements.hasAdvantage(caster, target);
        const hasDisadvantage = Elements.hasDisadvantage(caster, target);

        let critChance = critChanceOf(caster) - antiCritChanceOf(target);
        if (hasAdvantage) {
            critChance = Math.max(critChance + 15, 100);
        } else if (hasDisadvantage) {
            critChance = Math.min(critChance, 85);
        }

        let isCrit = false, isGlance = false, isCrush = false, dmg;

        const n = roll();
        if (n <= glancingChance) { // glance
            isGlance = true;
            dmg = glancedDmg(rawDmg, caster, target);
        } else if (n <= critChance) { // crit
            isCrit = true;
            dmg = critDmg(rawDmg, multipliers, caster.cd);
        } else if (n <= advMod) { // crush
            isCrush = true;
            dmg = crashedDmg(rawDmg, multipliers);
        } else { // normal
            dmg = normalDmg(rawDmg, multipliers);
        }

        return {
            ...ctx,
            isCrit,
            isGlance,
            isCrush,
            dmg: Math.round(dmg * dmgReducton(target) * randomDmgMultiplier(roll)),
        }
    }
}

export function simpleDmg(roll: rng, multiply: dmgMultiplier): BattleMechanic {
    return function (caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
        const rawDmg = multiply(caster, target);
        const advMod = elementAdvMod(caster, target);
        const glancingChance = glanceChanceOf(caster) + advMod;
        const hasAdvantage = Elements.hasAdvantage(caster, target);
        const hasDisadvantage = Elements.hasDisadvantage(caster, target);

        let critChance = critChanceOf(caster) - antiCritChanceOf(target);
        if (hasAdvantage) {
            critChance = Math.max(critChance + 15, 100);
        } else if (hasDisadvantage) {
            critChance = Math.min(critChance, 85);
        }

        let isCrit = false, isGlance = false, isCrush = false, dmg;

        const n = roll();
        if (n <= glancingChance) { // glance
            isGlance = true;
            dmg = glancedDmg(rawDmg, caster, target);
        } else if (n <= critChance) { // crit
            isCrit = true;
            dmg = critDmg(rawDmg, multipliers, caster.cd);
        } else if (n <= advMod) { // crush
            isCrush = true;
            dmg = crashedDmg(rawDmg, multipliers);
        } else { // normal
            dmg = normalDmg(rawDmg, multipliers);
        }

        return {
            ...ctx,
            isCrit,
            isGlance,
            isCrush,
            dmg: Math.round(dmg * dmgReducton(target) * randomDmgMultiplier(roll)),
        };
    }
}

function kindOfDmg(hit: HitContext) {
    if (hit.isCrit) return 'crit';
    if (hit.isCrush) return 'crushing';
    if (hit.isGlance) return 'glancing';
    return 'normal'
}

export function targetEnemy(caster: Contestant, targetId: string, units: Contestant[]): Contestant[] {
    return units.filter(u => u.id === targetId);
}

export function targetEnemies(caster: Contestant, targetId: string, units: Contestant[]): Contestant[] {
    return units.filter(u => u.player !== caster.player);
}

export function targetAllies(caster: Contestant, targetId: string, units: Contestant[]): Contestant[] {
    return units.filter(u => u.player === caster.player);
}

export function targetSelf(caster: Contestant, targetId: string, units: Contestant[]): Contestant[] {
    return caster;
}
export function targetAlly(caster: Contestant, targetId: string, units: Contestant[]): Contestant[] {
    // fixme: check team
    return units.filter(u => u.id === targetId);
}

export function multistep(steps: SkillStep[]): SkillStep {
    return (caster: Contestant, target: string, units: Contestant[], meta: SkillMultipliers) => {
        steps.forEach((stp) => stp(caster, target, units, meta));
    }
}

function hit(mechanics: BattleMechanic[]) {
    return (caster: Contestant, target: Contestant, meta: SkillMultipliers) => {
        const hit: HitContext = mechanics.reduce((ctx: HitContext, m: BattleMechanic) => {
            return m(caster, target, meta, ctx);
        }, { effectsAdded: [], effectsRemoved: [], resisted: [] });
        // todo: shields used
        if (hit.dmg) target.dmg(hit.dmg, kindOfDmg(hit));
        if (hit.effectsAdded.length) target.affect(hit.effectsAdded);
        if (hit.resisted.length) target.resist(hit.resisted);
    }
}

export function step(target: Targeter, ...mechanics: BattleMechanic[]): SkillStep {
    let combo = hit(mechanics);
    return (caster: Contestant, targetId: string, units: Contestant[], meta: SkillMultipliers) => {
        return target(caster, targetId, units).forEach(t => combo(caster, t, meta));
    }
}

function newDummySkill(roll) {
    const dummySkill: SkillSpec = {
        action: [
            step(
                targetEnemy,
                simpleAtkDmg(roll),
            ),
        ],
        meta: {
            dmg: 0.3,
            effect: 0.35,
            cooldown: 0,
        }
    };
    return new GenericSkill(1, dummySkill.meta, multistep(dummySkill.action))
}

export const GenericSkills: Map<number, (() => number) => Ability> = new Map([
    [1, newDummySkill],
]);

export class GenericSkill implements Ability {
    id: number;
    multipliers: SkillMultipliers;
    apply: SkillStep;
    cooldown: number = 0;
    maxCooldown: number;

    constructor(id: number, meta: SkillMeta, apply: SkillStep) {
        this.id = id;
        const { cooldown, ...multipliers } = meta;
        this.multipliers = multipliers;
        this.maxCooldown = cooldown;
        this.apply = apply;
    }

    cast(caster: Contestant, target: string, units: Contestant[]): void {
        this.apply(caster, target, units, this.multipliers);
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
    if (GenericSkills.has(id)) {
        let factory = GenericSkills.get(id);
        if (!factory) { return }
        return factory(defaultRng);
    }

    throw new Error(`Unknown skill: ${id}`)
}
