import {random} from 'lodash';
import {ActionContext, Contestant, System} from "../battle";
import type {HitEvent} from "../battle";
import {ELEMENT_RELATIONS} from "./index";
import target from './targeting';

export class Multiplier {
    evaluate(raw: string, context: ActionContext): number {
        const {caster: self, target} = context;
        return eval(raw);
    }
}

function hasDisadvantage(caster: Contestant, target: Contestant): boolean {
    return ELEMENT_RELATIONS[caster.element].weak === target.element;
}

function hasAdvantage(caster: Contestant, target: Contestant): boolean {
    return ELEMENT_RELATIONS[caster.element].strong === target.element;
}

interface DamageStrategy {
    name: string;
    apply(raw_dmg: number): number;
}

class GlancingDamageStrategy implements DamageStrategy {
    name = 'glancing';
    context: ActionContext;

    constructor(context: ActionContext) {
        this.context = context;
    }

    apply(raw_dmg: number): number {
        return raw_dmg - raw_dmg * 0.3 - (hasDisadvantage(this.context.caster, this.context.target) ? raw_dmg * 0.16 : 0);
    }
}

class CritDamageStrategy implements DamageStrategy {
    name = 'critical';
    context: ActionContext;

    constructor(context: ActionContext) {
        this.context = context;
    }

    apply(raw_dmg: number): number {
        return raw_dmg * (1 + (this.context.skill.additional_dmg + this.context.caster.cd) / 100);
    }
}

class CrushingDamageStrategy implements DamageStrategy {
    name = 'crushing';
    context: ActionContext;

    constructor(context: ActionContext) {
        this.context = context;
    }

    apply(raw_dmg: number): number {
        return raw_dmg * (1 + this.context.skill.additional_dmg / 100 + 0.3);
    }
}

class NormalDamageStrategy implements DamageStrategy {
    name = 'normal';
    context: ActionContext;

    constructor(context: ActionContext) {
        this.context = context;
    }

    apply(raw_dmg: number): number {
        return raw_dmg * (1 + this.context.skill.additional_dmg / 100);
    }
}

function roll(): number {
    return random(1, 100);
}

export class HitStrategyFactory {
    roll: roll;

    constructor(roll: roll) {
        this.roll = roll;
    }

    create(context: ActionContext): DamageStrategy {
        // todo: add elemental king effect = always advantage
        const glancing_chance = ELEMENT_RELATIONS[context.caster.element].weak === context.target.element ? 15 : 0;
        if (this.roll() <= (glancing_chance + context.caster.glancing_mod)) {
            return new GlancingDamageStrategy(context);
        } else if (this.roll() <= context.target.cr) {
            return new CritDamageStrategy(context);
        } else if (hasAdvantage(context.caster, context.target) && this.roll() <= 15) {
            return new CrushingDamageStrategy(context);
        }

        return new NormalDamageStrategy(context);
    }
}

type HitConfig = {

}

function configure(conf: string | Object): HitConfig {
    if (typeof conf === 'string') {
        return {
            target: 'enemy',
            multiplier: conf,
            ignore_def: false,
            ...conf,
        }
    }

    if (!conf.multiplier) {
        throw new Error('Damage must have multiplier');
    }

    return {
        target: 'enemy',
        ignore_def: false,
        ...conf,
    }
}

// SYSTEM
export class EnemyDmgSystem implements System {
    hit_strategy_factory: HitStrategyFactory;
    formula: Multiplier;

    constructor(hit_policy_factory: HitStrategyFactory, formula: Multiplier) {
        this.hit_strategy_factory = hit_policy_factory;
        this.formula = formula;
    }

    apply(context: ActionContext, step, events: Event[] = []): ?HitEvent[] {
        if (step.enemy_dmg) {
            let config = configure(step.enemy_dmg);

            const raw_dmg = this.formula.evaluate(config.multiplier, context);

            return target(config.target, context).map(target => {

                const strategy = this.hit_strategy_factory.create({
                    ...context,
                    target,
                });

                const multiplied_dmg = strategy.apply(raw_dmg);
                // todo: implement modifiers eg. branding, Molly's passive, glancing debuf, etc.

                return {
                    name: 'hit',
                    payload: {
                        target: target.id,
                        type: strategy.name,
                        damage: Math.floor(
                            multiplied_dmg - (config.ignore_def ? 0 : 1000 / (1140 + 3.5 * target.def))
                        ),
                    }
                };
            });

            // return [{
            //     name: 'hit',
            //     payload: {
            //         target: context.target.id,
            //         type: strategy.name,
            //         damage: Math.floor(
            //             multiplied_dmg - (ignore_def ? 0 : 1000 / (1140 + 3.5 * context.target.def))
            //         ),
            //     }
            // }];
        }
    }
}
