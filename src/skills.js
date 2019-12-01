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
type BattleMechanic = (Contestant, Contestant, SkillMeta) => void;

function targetEnemy(targetId, units: Contestant[]): Contestant[] {
    return units.filter(u => u.id === targetId);
}

type SkillSpec = {
    target: Targeter,
    action: BattleMechanic[],
    meta: SkillMeta,
}

type SkillMeta = {
    cooldown: number,
    dmgMultiplier: number,
    effectMultiplier: number,
}

function defaultRng(): number {
    return _.random(1, 100);
}

type rng = () => number;

function hit(roll: rng = defaultRng) {
    let chance = roll();
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
}

const dummySkill:SkillSpec = {
    target: targetEnemy,
    action: [
        function (caster: Contestant, target: Contestant, params: SkillMeta) {
            const rawDmg = caster.atk * 3.3 + 35;
            target.dmg(rawDmg * (100 + params.dmgMultiplier) / 100);
        }
    ],
    meta: {
        dmgMultiplier: 0.3,
        effectMultiplier: 0.35,
        cooldown: 0,
    }
};


const GenericSkills: Map<number, SkillSpec> = new Map([
    [1, dummySkill],
]);

function compose(mechanics: BattleMechanic[]): BattleMechanic {
    return (caster: Contestant, target: Contestant, meta: SkillMeta) => {
        mechanics.forEach((m) => m(caster, target, meta));
    }
}

export function GetSkill(id: number) {
    let spec: ?SkillSpec = GenericSkills.get(id);
    if (spec) {
        return new GenericSkill(
            spec.meta,
            spec.target,
            compose(spec.action),
        );
    }

    throw new Error(`Unknown skill: ${id}`)
}


class GenericSkill implements Ability {
    meta: SkillMeta;
    target: Targeter;
    apply: BattleMechanic;
    cooldown: number = 0;

    constructor(meta: SkillMeta, target: Targeter, apply: BattleMechanic) {
        this.meta = meta;
        this.target = target;
        this.apply = apply;
    }

    cast(caster: Contestant, target: string, units: Contestant[]) {
        this.target(target, units).forEach(t => this.apply(caster, t, this.meta));
        this.cooldown = this.meta.cooldown;
    }

    refresh(turns: number) {
        if (turns > 0) {
            this.cooldown = Math.max(0, this.cooldown - turns);
        } else {
            this.cooldown = 0;
        }
    }
}
