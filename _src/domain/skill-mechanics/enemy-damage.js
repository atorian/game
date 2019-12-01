import _ from 'lodash';
import type {Targeted, Contestant} from "../";
import type {ActionContext, Mechanics} from "../skill-mechanics";
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

        return raw_dmg * (100 + this.context.skill.power + this.context.caster.cd) / 100;
    }
}

class CrushingDamageStrategy implements DamageStrategy {
    name = 'crushing';
    context: ActionContext;

    constructor(context: ActionContext) {
        this.context = context;
    }

    apply(raw_dmg: number): number {
        return raw_dmg * (100 + this.context.skill.power + 30) / 100;
    }
}

class NormalDamageStrategy implements DamageStrategy {
    name = 'normal';
    context: ActionContext;

    constructor(context: ActionContext) {
        this.context = context;
    }

    apply(raw_dmg: number): number {
        return raw_dmg * (100 + this.context.skill.power) / 100;
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
        const crit_mod = hasAdvantage(context.caster, context.target) ? 15 : 0;

        if (this.roll() <= (glancing_chance + context.caster.glancing_mod)) {
            return new GlancingDamageStrategy(context);
        } else if (this.roll() <= context.caster.cr + crit_mod) {
            return new CritDamageStrategy(context);
        } else if (hasAdvantage(context.caster, context.target) && this.roll() <= 15) {
            return new CrushingDamageStrategy(context);
        }

        return new NormalDamageStrategy(context);
    }
}

type HitConfig = Targeted & {
    multiplier: string,
    ignore_def: boolean,
}

function configure(conf: string | Object): HitConfig {
    if (typeof conf === 'string') {
        return {
            multiplier: conf,
            ignore_def: false,
            ...conf,
        }
    }

    if (!conf.multiplier) {
        throw new Error('Damage must have multiplier');
    }

    return {
        ignore_def: false,
        ...conf,
    }
}

// SYSTEM
export class EnemyDmgSystem implements Mechanics {
    hit_strategy_factory: HitStrategyFactory;
    formula: Multiplier;

    constructor(hit_policy_factory: HitStrategyFactory, formula: Multiplier) {
        this.hit_strategy_factory = hit_policy_factory;
        this.formula = formula;
    }

    apply(context: ActionContext, step, events: Event[] = []): ?HitEvent[] {
        let config = configure(step);
        const raw_dmg = this.formula.evaluate(config.multiplier, context);

        return target(config.target, context)
            .filter(u => u.hp)
            .reduce((mechanic_events:[], target: Contestant) => {
                const strategy = this.hit_strategy_factory.create({
                    ...context,
                    target,
                });

                const multiplied_dmg = strategy.apply(raw_dmg);
                // todo: implement modifiers eg. branding, Molly's passive, glancing debuf, etc.

                const dmgReduction = 1000 / (1140 + 3.5 * (config.ignore_def ? 0 : target.def));
                const randomFunctor = 1 + (_.random(0, 10) - 2) / 100;

                const shields = target.effects.filter(e => e.effect === 'shield' || e.effect === 'rune_shield');
                const dmg = Math.floor(multiplied_dmg * dmgReduction * randomFunctor);

                // todo: add invincibility
                const {dmg: finalDmg, shield_events} = shields.reduce(({dmg, shield_events}, e) => {
                    const finalDmg = Math.max(dmg - e.value, 0);
                    if (finalDmg > 0) {
                        return {
                            dmg: finalDmg,
                            shield_events: [...shield_events, {
                                name: 'effect_removed',
                                payload: {
                                    target: target.id,
                                    effect: e.effect,
                                }
                            }]
                        }
                    }

                    return {
                        dmg: finalDmg,
                        shield_events,
                    };

                }, {dmg, shield_events: []});

                return [
                    ...mechanic_events,
                    ...shield_events, {
                    name: 'hit',
                    payload: {
                        target: target.id,
                        type: strategy.name,
                        damage: finalDmg,
                    }
                }];
            }, []);
    }
}
