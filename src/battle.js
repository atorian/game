import {EnemyDmgSystem, HitStrategyFactory, Multiplier} from "./mechanics/enemy-damage";
import {createResistPolicy, HarmfulEffects} from "./mechanics/harmful-effects";
import {BeneficialEffects} from "./mechanics/beneficial-effects";
import type {Skill} from "./units";
import _ from 'lodash';
import {AtbManipulation} from "./mechanics/atb-effects";


export type Unit = {
    name: string,
    element: 'water' | 'fire' | 'wind' | 'light' | 'dark',
    base_hp: number,
    base_atk: number,
    base_def: number,
    base_spd: number,
    base_cr: number,
    base_cd: number,
    base_acc: number,
    base_res: number,
    skills: Skill[],
}

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

export type RunedUnit = Unit & {
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
    runes: Rune[],
}

export type Contestant = RunedUnit & {
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
    cooldowns: { [string]: number }
}

function contestant(u: RunedUnit): Contestant {
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
        cooldowns: u.skills.reduce((cooldowns, skill) => {
            return {
                ...cooldowns,
                [skill.id]: 0,
            }
        }, {})
    }
}


type BattleStarted = {
    teamA: RunedUnit[],
    teamB: RunedUnit[],
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

export type TemporalEffect = Effect & {
    duration: number,
}

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
            // todo: add check for inability effects
            cooldowns: unit.skills.reduce((cooldowns, skill) => {
                return {
                    ...cooldowns,
                    [skill.id]: Math.max(0, unit.cooldowns[skill.id]--),
                }
            }, {})
        };
    },
    turn_ended(event: any) {
        const deadUnits = Object.values(this.units).filter(u => u.hp === 0);
        this.unit = null;
        deadUnits.forEach((u) => {
            causes.call(this, {
                name: 'unit_died',
                payload: {
                    target: u.id,
                }
            })
        });
    },
    unit_died(event: Targeted) {
        const players = Object.values(this.units)
            .filter(u => u.hp > 0)
            .map(u => u.player);

        this.units[event.target].atb = 0;

        if (_.uniq(players).length === 1) {
            causes.call(this, {
                name: 'battle_ended',
                payload: {
                    winner: players[0],
                }
            })
        }
    },
    battle_ended(event) {
        this.winner = event.winner;
    },
    skill_used(event: WithSkill) {
        // skill_id
        const {unit_id: target, skill_id} = event;
        this.units[target].cooldowns[skill_id] = this.units[target].skills
            .find(s => s.id === skill_id)
            .cooltime;
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
    atb_boost(event: TargetModifier) {
        const target = this.units[event.target];

        this.units[event.target] = {
            ...target,
            atb: target.atb + event.value,
        }
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
    // todo: this.mechanics.apply(m => m.handle(event));
    this.applyEvent(event);
}

const ATB_SIZE = 100;

function isReady(unit) {
    return unit.atb >= ATB_SIZE;
}

function byReadiness(uA: Contestant, uB: Contestant) {
    return uA.atb - uB.atb;
}

function roll() {
    return _.random(1, 100);
}

export class GuildWarBattle {
    units: Contestant[];
    unit: Contestant;
    winner: number;

    constructor(teamA: RunedUnit[], teamB: RunedUnit[]) {
        this.events = [];
        this.version = 0;
        this.mechanics = new SkillSystem();
        this.mechanics.add(new EnemyDmgSystem(
            new HitStrategyFactory(roll),
            new Multiplier()
        ));
        this.mechanics.add(new HarmfulEffects(
            createResistPolicy(roll),
        ));
        this.mechanics.add(new BeneficialEffects());
        this.mechanics.add(new AtbManipulation());

        causes.call(this, {
            name: 'battle_started',
            payload: {
                teamA,
                teamB,
            },
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

        while (!this.unit) {
            causes.call(this, {
                name: 'tick',
                payload: Object.values(this.units)
                    .reduce(function (payload: { [string]: number }, unit: Contestant) {
                        return {
                            ...payload,
                            [unit.id]: 1 * (unit.spd * 0.07).toFixed(2),
                        }
                    }, {})
            });

            const nextUnit = Object.values(this.units)
                .filter(isReady)
                .sort(byReadiness)
                .pop();

            if (nextUnit) {
                // todo: use unit id
                causes.call(this, {
                    name: 'turn_started',
                    payload: {
                        target: nextUnit.id,
                    }
                })
            }
        }
    }

    useSkill(player, skill_id, target_id) {
        // todo: validate target
        if (this.unit.player !== player) {
            throw new Error('Cheater!!!');
        }

        causes.call(this, {
            name: 'skill_used',
            payload: {
                unit_id: this.unit.id,
                skill_id,
            }
        });

        const skill = this.unit.skills.find(skill => skill.id === skill_id);

        const events = this.mechanics.apply({
            caster: this.unit,
            target: this.units[target_id],
            skill: skill,
            battlefield: this.units,
            additional_dmg: skill.additional_dmg,
            additional_chance: skill.additional_chance,
        }, skill);

        events.forEach(causes.bind(this));

        causes.call(this, {
            name: 'turn_ended',
            payload: {
                unit_id: this.unit.id,
            }
        });

        if (!this.ended) {
            this.next();
        }
    }
}

export type ActionContext = {
    caster: Contestant,
    battlefield: Contestant[],
    target: Contestant,
    skill: Skill,
    additional_dmg: 0,
    additional_chance: 0
}


class SkillSystem {
    systems: SystemsAggregate;

    constructor() {
        this.systems = new SystemsAggregate();
    }

    add(system: System) {
        this.systems.add(system)
    }

    apply(context: ActionContext, skill) {
        return skill.iterations.reduce((events, step) => {
            return [
                ...events,
                ...this.systems.apply(context, step, events)
            ];
        }, []);
    }
}

export interface System {
    apply(context: ActionContext, step: any, events: Event[]): Event[];
}

class SystemsAggregate {
    systems: System[] = [];

    add(system: System) {
        this.systems.push(system);
    }

    apply(context: ActionContext, step) {
        return this.systems.reduce((events, system) => {
            const new_events = system.apply(context, step, events);
            if (new_events) {
                return [...events, ...[].concat(new_events)];
            }
            return events;
        }, []);
    }
}


// battle started
// will runes buf applied
// shield runes buf applied
// fight runes effect applied
// molly's passive aura applied
