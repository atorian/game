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


function targetEnemy(targetId, units: Contestant[]): Contestant[] {
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

// function hit(roll: rng = defaultRng) {
//     let chance = roll();
// todo: add elemental king effect = always advantage
// const glancing_chance = ELEMENT_RELATIONS[context.caster.element].weak === context.target.element ? 15 : 0;
// const crit_mod = hasAdvantage(context.caster, context.target) ? 15 : 0;
//
// if (n <= (glancing_chance + context.caster.glancing_mod)) {
//     return new GlancingDamageStrategy(context);
// } else if (this.roll() <= context.caster.cr + crit_mod) {
//     return new CritDamageStrategy(context);
// } else if (hasAdvantage(context.caster, context.target) && this.roll() <= 15) {
//     return new CrushingDamageStrategy(context);
// }
//
// return new NormalDamageStrategy(context);
// }

type ActionContext = {
    caster: Contestant,
    target: Contestant,
    params: SkillMultipliers,
}

function atkOf(u: Contestant): number {
    if (u.effects.has('atk-increase')) {
        return u.atk + u.atk * 0.5
    }
    return u.atk;
}

function defOf(u: Contestant): number {
    if (u.effects.has('def-increase')) {
        return u.def + u.def * 0.7
    }
    return u.def;
}

type HitContext = {
    dmg?: number,
    isCrit?: boolean,
    isGlance?: boolean,
    effects?: Object[],
}

export function simpleAtkDmg(caster: Contestant, target: Contestant, multipliers: SkillMultipliers, ctx: HitContext): HitContext {
    const rawDmg = atkOf(caster) * 3.3 + 35;
    const dmgReduction = 1000 / (1140 + 3.5 * defOf(target));
    const randomFunctor = 1 + (_.random(0, 10) - 2) / 100;
    // todo: switch normal crit crush glance
    return {
        ...ctx,
        isCrit: false,
        isGlance: false,
        dmg: rawDmg * (100 + multipliers.dmg) / 100 * dmgReduction * randomFunctor,
    }
}

function step(...mechanics: BattleMechanic[]): SkillStep {
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
            simpleAtkDmg
        ),
    ],
    meta: {
        dmg: 0.3,
        effect: 0.35,
        cooldown: 0,
    }
};

const GenericSkills: Map<number, SkillSpec> = new Map([
    [1, dummySkill],
]);

function multistep(steps: SkillStep[]): SkillStep {
    return (caster: Contestant, target: Contestant, meta: SkillMultipliers) => {
        steps.forEach((m) => m(caster, target, meta));
    }
}

export function GetSkill(id: number) {
    let spec: ?SkillSpec = GenericSkills.get(id);
    if (spec) {
        return new GenericSkill(
            spec.meta,
            spec.target,
            multistep(spec.action),
        );
    }

    throw new Error(`Unknown skill: ${id}`)
}

class GenericSkill implements Ability {
    multipliers: SkillMultipliers;
    target: Targeter;
    apply: SkillStep;
    cooldown: number = 0;
    maxCooldown: number;

    constructor(meta: SkillMeta, target: Targeter, apply: SkillStep) {
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
