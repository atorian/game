import _ from 'lodash';
import EventEmitter from 'events';
import BattleMechanics from "./battle-mechanics";
import SkillMechanics from "./skill-mechanics";
import type {Contestant, Effect, StatDecrease, Targeted, TemporalEffect, Unit} from "./index";

export function contestant(u: Unit): Contestant {
    return {
        ...u,
        max_hp: u.hp,
        max_atk: u.atk,
        max_def: u.def,
        max_spd: u.spd,
        max_cr: u.cr,
        max_cd: u.cd,
        max_res: u.res,
        max_acc: u.acc,
        atb: 0,
        effects: [],
        glancing_mod: 0,
        is_dead: false,
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

type WithSkill = Targeted & {
    skill_id: string
}

type Tick = { [string]: number }

export type Event = {
    name: string,
    payload: any,
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
        this.next_unit = null;
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

        if (!this.additional_turn) {
            this.unit = null;
        }

        const deadUnits = Object.values(this.units)
            .filter(u => u.hp === 0 && !u.is_dead);

        deadUnits.forEach((u) => {
            this.emit('unit_died',{
                target: u.id,
            });
        });

        const players = Object.values(this.units)
            .filter(u => u.hp > 0)
            .map(u => u.player);

        if (_.uniq(players).length === 1) {
            this.emit('battle_ended', {
                winner: players[0],
            });
        }
    },
    unit_died(event: Targeted) {
        this.units[event.target] = {
            ...this.units[event.target],
            is_dead: true,
            atb: 0,
            effects: []
        };
    },
    battle_ended(event) {
        this.winner = event.winner;
    },
    skill_used(event: WithSkill) {
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
        this.units[event.target] = {
            ...target,
            effects: [...target.effects, event],
            [stat]: target[stat] - value,
        }
    },
    buffed(event: TemporalEffect|StatDecrease) {
        const target = this.units[event.target];
        if (event.stat) {
            this.units[event.target] = {
                ...target,
                effects: [...target.effects, event],
                [event.stat]: target[event.stat] + event.value,
            }
        } else {
            this.units[event.target] = {
                ...target,
                effects: [...target.effects, event],
            }
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
            dead: false,
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
    auto_action({unit, skill_id}) {
        cast.call(
            this,
            this.units[unit].skills.find(s => s.id === skill_id),
            null,
            this.units[unit]
        )
    },
    additional_turn({unit_id}) {
        this.next_unit = unit_id;
    }
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

function cast(skill, target=null, caster=null) {

    this.skill_mechanics.apply({
        battlefield: this.units,
        caster: caster || this.unit,
        skill,
        target,
    }).forEach(e => this.emit(e.name, e.payload));

    // todo: emit action ended - let monsters die here
    this.emit('action_ended');

    // when reacting - other actions can not be triggered,
    // but defencive effects - could be
    this.reacting = true;
    this.pending_actions.forEach((action) => {
        const skill = this.units[action.unit_id].skills.find(s => s.id === action.skill_id);
        this.skill_mechanics.apply({
            battlefield: this.units,
            caster: this.units[action.unit_id],
            skill: action.guard ? {...skill, ...skill.guard} : skill,
            target: action.target ? this.units[action.target] : null,
        }).forEach(e => this.emit(e.name, e.payload));
    });
    this.pending_actions = [];
    this.reacting = false;
}

export class Battle extends EventEmitter {
    units: Contestant[];
    unit: Contestant;
    winner: number;
    pending_actions: Action[];
    next_unit: false;
    reacting: boolean = false;

    constructor(teamA: Unit[], teamB: Unit[]) {
        this.events = [];
        this.version = 0;
        this.pending_actions = [];
        this.skill_mechanics = new SkillMechanics();

        // order is important Battle must subscribe first to apply events first
        Object.keys(eventHandlers).forEach(event => {
            this.on(event, (payload) => {
                causes.call(this, {
                    name: event,
                    payload
                })
            })
        });

        this.battle_mechanics = new BattleMechanics();
        this.battle_mechanics.subscribe(this);

        this.emit('battle_started', {
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
        if (this.next_unit) {
            this.emit('turn_started', {
                target: this.next_unit,
            });
        } else {
            while (!this.unit) {
                this.emit(
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
                    this.emit('turn_started', {
                        target: nextUnit.id,
                    });
                }
            }
        }
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

        this.emit('skill_used', {
            unit_id: this.unit.id,
            skill_id,
            target_id,
        });

        cast.call(this, skill, this.units[target_id]);

        this.emit('turn_ended', {
            unit_id: this.unit.id,
        });
    }
}
