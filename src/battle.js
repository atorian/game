import {EnemyDmgSystem, HitStrategyFactory, Multiplier} from "./mechanics/enemy-damage";
import HarmfulEffectsFactory, {roll, RandomHarmfulEffects} from "./mechanics/";
import {BeneficialEffects, BUFFS} from "./mechanics/beneficial-effects";
import type {Skill} from "./units";
import _ from 'lodash';
import {AtbManipulation} from "./mechanics/atb-effects";
import {Strip} from "./mechanics/strip";
import {createResistPolicy} from "./mechanics/harmful-effects";
import {BaseUnit} from "./units";
import BattleMechanics from "./battle-mechanics";
import EventEmitter from 'events';
import {Heal} from "./mechanics/heal";
import {Revive} from "./mechanics/revive";

export type RuneSet =
    'Energy'
    | 'Swift'
    | 'Fatal'
    | 'Blade'
    | 'Rage'
    | 'Guard'
    | 'Violent'
    | 'Shield'
    | 'Will'
    | 'Endure'
    | 'Focus';

export type Rune = {
    set: RuneSet,
    hp: number,
    atk: number,
    def: number,
    spd: number,
    'hp%': number,
    'atk%': number,
    'def%': number,
    cr: number,
    cd: number,
    acc: number,
    res: number,
    slot: 1 | 2 | 3 | 4 | 5 | 6
}

type UnitId = string;

export type Unit = BaseUnit & {
    id: UnitId,
    player: string,
    max_hp: number,
    max_atk: number,
    max_def: number,
    max_spd: number,
    max_cr: number,
    max_cd: number,
    max_acc: number,
    max_res: number,
    rune_sets: RuneSet[],
}

export type Contestant = Unit & {
    atb: number,
    hp: number,
    atk: number,
    def: number,
    spd: number,
    cr: number,
    cd: number,
    res: number,
    acc: number,
    glancing_mod: number,
    effects: TemporalEffect[],
    is_revivable: boolean,
    cooldowns: { [string]: number }
}

function contestant(u: Unit): Contestant {
    return {
        ...u,
        hp: u.max_hp,
        atk: u.max_atk,
        def: u.max_def,
        spd: u.max_spd,
        cr: u.max_cr,
        cd: u.max_cd,
        res: u.max_res,
        acc: u.max_acc,
        atb: 0,
        effects: [],
        glancing_mod: 0,
        is_revivable: true,
        cooldowns: u.skills.reduce((cooldowns, skill) => {
            return {
                ...cooldowns,
                [skill.id]: 0,
            }
        }, {})
    }
}


type BattleStarted = {
    teamA: Unit[],
    teamB: Unit[],
}

export type Targeted = {
    target?: UnitId
}
type WithSkill = Targeted & {
    skill_id: string
}
type Tick = { [string]: number }


export type EnemyTarget = 'enemy' | 'aoe_enemy';
export type AllyTarget = 'self' | 'ally' | 'aoe_ally' | 'not_self';
export type Target = AllyTarget & EnemyTarget ;

export type Event = {
    name: string,
    payload: any,
}

export type Effect = Targeted & {
    effect: string,
}

export type Temporal = {
    duration: number,
};

export type TemporalEffect = Effect & Temporal;

export type StatDecrease = TemporalEffect & {
    stat: string,
    value: number,
}

export type HitEvent = Event & {
    payload: Hit
}

export type Hit = Targeted & {
    type: 'normal' | 'critical' | 'glancing' | 'crushing',
    damage: number,
}

// not target as it's only allowed to target ally
export type WithValue = {
    value: number,
}
export type TargetModifier = Targeted & WithValue;


const eventHandlers = {
    battle_started(event: BattleStarted) {
        this.units = [
            ...event.teamA.map(contestant),
            ...event.teamB.map(contestant)
        ].reduce((map, u) => {
            return {
                ...map,
                [u.id]: u,
            }
        }, {});
    },
    tick(event: Tick) {
        this.units = Object.values(this.units).reduce(
            (units, unit) => {
                return {
                    ...units,
                    [unit.id]: {
                        ...unit,
                        atb: unit.atb + event[unit.id]
                    }
                }
            },
            {}
        );
    },
    turn_started(event: Targeted) {
        const unit = this.units[event.target];
        this.unit = this.units[event.target] = {
            ...unit,
            atb: 0,
            // todo: add check for inability effects, extract to other event?
            cooldowns: unit.skills.reduce((cooldowns, skill) => {
                return {
                    ...cooldowns,
                    [skill.id]: Math.max(0, unit.cooldowns[skill.id]--),
                }
            }, {})
        };
    },
    effect_duration_reduced({target, effect, duration}) {
        const effects = this.units[target].effects;
        const tmpEffect = effects.find(e => e.effect === effect);
        effects[effects.indexOf(tmpEffect)] = {
            ...tmpEffect,
            duration,
        };

        this.units[target] = {
            ...this.units[target],
            effects,
        };
    },
    effect_removed({target, effect}) {
        const effects = this.units[target].effects;

        this.units[target] = {
            ...this.units[target],
            // fixme: this will remove all dots, should remove just 1
            effects: effects.filter(e => e.effect !== effect)
        };
    },
    turn_ended(event: any) {

        this.unit.effects.forEach((e: Effect | TemporalEffect) => {
            if (e.duration) {
                if (e.duration > 1) {
                    causes.call(this, {
                        name: 'effect_duration_reduced',
                        payload: {
                            target: this.unit.id,
                            effect: e.effect,
                            duration: e.duration - 1,
                        }
                    });
                } else {
                    causes.call(this, {
                        name: 'effect_removed',
                        payload: {
                            target: this.unit.id,
                            effect: e.effect,
                        }
                    });
                }
            }
        });


        this.unit = null;

        const deadUnits = Object.values(this.units).filter(u => u.hp === 0);
        deadUnits.forEach((u) => {
            this.dispatcher.emit('unit_died',{
                target: u.id,
            });
        });

        const players = Object.values(this.units)
            .filter(u => u.hp > 0)
            .map(u => u.player);

        if (_.uniq(players).length === 1) {
            this.dispatcher.emit('battle_ended', {
                winner: players[0],
            });
        }
    },
    unit_died(event: Targeted) {
        this.units[event.target] = {
            ...this.units[event.target],
            atb: 0,
            effects: []
        };
    },
    battle_ended(event) {
        this.winner = event.winner;
    },
    skill_used(event: WithSkill) {
        // skill_id
        const {unit_id: target, skill_id} = event;
        this.units[target].cooldowns[skill_id] = this.units[target].skills
            .find(s => s.id === skill_id)
            .cooltime || 0;
    },
    hit(event: Hit) {
        const target = this.units[event.target];
        this.units[event.target] = {
            ...target,
            hp: Math.max(0, target.hp - event.damage),
        }
    },
    debuffed(event: TemporalEffect) {
        const target = this.units[event.target];
        const {stat, value} = event;
        // todo: Create EffectsBag class
        this.units[event.target] = {
            ...target,
            effects: [...target.effects, event],
            [stat]: target[stat] - value,
        }
    },
    buffed(event: TemporalEffect) {
        const target = this.units[event.target];
        const {stat, value} = event;
        // todo: Create EffectsBag class
        this.units[event.target] = {
            ...target,
            effects: [...target.effects, event],
            [stat]: target[stat] + value,
        }
    },
    strip(event: Effect) {
        const target = this.units[event.target];
        const {effect} = event;
        // todo: Create EffectsBag class
        const removedEffect: TemporalEffect | StatDecrease = target.effects.find(e => e.effect === effect);

        if (removedEffect.stat) {
            this.units[event.target] = {
                ...target,
                effects: target.effects.filter(e => e !== removedEffect),
                [removedEffect.stat]: [removedEffect.stat] - removedEffect.value,
            }
        } else {
            this.units[event.target] = {
                ...target,
                effects: target.effects.filter(e => e !== removedEffect),
            }
        }
    },
    atb_increase(event: TargetModifier) {
        const target = this.units[event.target];
        this.units[event.target] = {
            ...target,
            atb: target.atb + event.value,
        }
    },
    nemezis({unit, value}) {
        const target = this.units[unit];
        this.units[unit] = {
            ...target,
            atb: target.atb + value,
        }
    },
    heal({target, value}) {
        const unit = this.units[target];
        this.units[target] = {
            ...unit,
            hp: Math.min(unit.hp + value, unit.max_hp),
        }
    },
    revived({target, hp}) {
        const unit = this.units[target];
        this.units[target] = {
            ...unit,
            effects:[],
            hp,
        }
    },
    guard_triggered(event) {
        this.pending_actions.push(event);
        const {unit_id, skill_id} = event;
        this.units[unit_id].cooldowns[skill_id] = this.units[unit_id].skills
            .find(s => s.id === skill_id)
            .cooltime || 0;
    },
};

function when(event: Event) {
    const handler = eventHandlers[event.name];
    if (handler) {
        handler.call(this, event.payload);
    } else {
        console.warn(`Can not handle event: ${event.name}`);
    }
}

function causes(event) {
    this.events.push(event);
    this.applyEvent(event);
}

const ATB_SIZE = 100;

function isReady(unit) {
    return unit.atb >= ATB_SIZE;
}

function byReadiness(uA: Contestant, uB: Contestant) {
    return uA.atb - uB.atb;
}

type Action = {
    unit_id: string,
    skill_id: string,
    guard?: boolean,
    target_id?: string,
}

export class Battle {
    units: Contestant[];
    unit: Contestant;
    winner: number;
    pending_actions: Action[];
    reacting: boolean = false;

    constructor(teamA: Unit[], teamB: Unit[]) {
        this.events = [];
        this.pending_actions = [];
        this.version = 0;
        this.dispatcher = new EventEmitter();
        this.skill_mechanics = new SkillMechanics();

        Object.keys(eventHandlers).forEach(event => {
            this.dispatcher.on(event, (payload) => {
                causes.call(this, {
                    name: event,
                    payload
                })
            })
        });

        this.battle_mechanics = new BattleMechanics();
        this.battle_mechanics.subscribe(this);

        this.dispatcher.emit('battle_started', {
            teamA,
            teamB,
        });
    }

    applyEvent(event) {
        when.call(this, event);
        this.version += 1;
    }

    get ended() {
        return this.winner !== undefined;
    }

    next() {

        // todo: check 2 monsters with same skill. first placed should take a turn
        while (!this.unit) {
            this.dispatcher.emit(
                'tick',
                Object.values(this.units)
                    .filter(unit => unit.hp > 0)
                    .reduce(function (payload: { [string]: number }, unit: Contestant) {
                        return {
                            ...payload,
                            [unit.id]: 1 * (unit.spd * 0.07).toFixed(2),
                        }
                    }, {})
            );

            const nextUnit = Object.values(this.units)
                .filter(isReady)
                .sort(byReadiness)
                .pop();

            if (nextUnit) {
                // todo: use unit id
                this.dispatcher.emit('turn_started', {
                    target: nextUnit.id,
                })
            }
        }
    }

    cast(skill, target=null, caster=null) {
        // todo: emit start action
        this.skill_mechanics.apply({
            battlefield: this.units,
            caster: caster || this.unit,
            skill,
            target,
        }).forEach(e => this.dispatcher.emit(e.name, e.payload));

        this.reacting = true;
        this.pending_actions.forEach((action) => {
            const skill = this.units[action.unit_id].skills.find(s => s.id === action.skill_id);
            this.skill_mechanics.apply({
                battlefield: this.units,
                caster: this.units[action.unit_id],
                skill: action.guard ? {...skill, ...skill.guard} : skill,
                target: action.target ? this.units[action.target] : null,
            }).forEach(e => this.dispatcher.emit(e.name, e.payload));
        });
        this.pending_actions = [];

        // todo: emit action ended
    }

    useSkill(player, skill_id, target_id) {
        if (this.unit.player !== player) {
            throw new Error('Cheater!!!');
        }

        if (this.unit.cooldowns[skill_id] !== 0) {
            throw new Error('Cheater!!!');
        }

        const skill = this.unit.skills.find(skill => skill.id === skill_id);

        if (skill.passive) {
            throw new Error('You are not allowed to trigger this skill.');
        }

        this.dispatcher.emit('skill_used', {
            unit_id: this.unit.id,
            skill_id,
            target_id,
        });

        this.cast(skill, this.units[target_id]);

        this.dispatcher.emit('turn_ended', {
            unit_id: this.unit.id,
        });
    }
}

export type ActionContext = {
    caster: Contestant,
    battlefield: Contestant[],
    target: Contestant,
    skill: Skill
}

class SkillMechanics {

    constructor() {
        this.mechanics = new Map();
        this.mechanics.set('enemy_dmg', new EnemyDmgSystem(
            new HitStrategyFactory(roll),
            new Multiplier()
        ));

        for (const debuf of [
            'def_break',
            'atk_break',
            'slow',
            'glancing',
            'brand',
            'block_buf',
            'unrecoverable',
            'taunt',
            'oblivion',
            'freeze',
            'stun',
            'sleep',
            'silence',
        ]) {
            this.mechanics.set(
                debuf,
                HarmfulEffectsFactory.create(debuf)
            );
        }

        this.mechanics.set(
            'random_debuf',
            new RandomHarmfulEffects(
                HarmfulEffectsFactory
            )
        );

        this.mechanics.set('atb_boost', new AtbManipulation('increase'));
        this.mechanics.set('atb_decrease', new AtbManipulation('decrease'));
        this.mechanics.set('heal', new Heal(new Multiplier()));
        this.mechanics.set('revive', new Revive(new Multiplier()));
        // todo: add `dot` and `bomb` skill_mechanics


        for (const buf in BUFFS) {
            this.mechanics.set(buf, new BeneficialEffects(BUFFS[buf]));
        }

        this.mechanics.set('strip', new Strip(
            createResistPolicy(roll),
            roll,
        ));
    }

    set(id, mechanic) {
        this.mechanics.set(id, mechanic);
    }

    apply(context: ActionContext) {
        // todo: add random amount of iterations @see Rigel, Okeanos
        return context.skill.iterations.reduce((events, step) => {
            return Object.keys(step).reduce((accumulated_events, mechanic_id) => {

                if (this.mechanics.has(mechanic_id)) {
                    return [
                        ...accumulated_events,
                        ...(this.mechanics.get(mechanic_id).apply(
                            context,
                            step[mechanic_id],
                            accumulated_events
                        ) || []),
                    ]
                }

                console.debug('unknown skill_mechanics: ', mechanic_id);
                return accumulated_events;

            }, events);
        }, []);
    }
}

export interface Mechanics {
    apply(context: ActionContext, step: any, events: Event[]): Event[];
}

// battle started
// will runes buf applied
// shield runes buf applied
// fight runes effect applied
// molly's passive aura applied
