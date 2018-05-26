import {EnemyDmgSystem, HitStrategyFactory, Multiplier, ELEMENT_RELATIONS} from "./mechanics/single-target-damage";
import type {Skill} from "./units";
import _ from 'lodash';
import {createResistPolicy, HarmfulEffects} from "./mechanics/harmful-effects";

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
        glancing_chance(element) {
            console.log(element);
            const chance = ELEMENT_RELATIONS[this.element].weak === element ? 15 : 0;
            console.log('chance', chance);
            return chance;
        },
        cooldowns: u.skills.reduce((cooldowns, skill) => {
            return {
                ...cooldowns,
                [skill.id]: 0,
            }
        }, {})
    }
}


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

export type RuneSet = 'Energy' | 'Swift' | 'Fatal' | 'Blade' | 'Rage' | 'Guard' | 'Violent' | 'Shield' | 'Will';
export type Rune = {
    set: RuneSet,
    'hp%': number,
    'atk%': number,
    slot: 1 | 2 | 3 | 4 | 5 | 6
}

export type RunedUnit = Unit & {
    id: string,
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
    glancing_chance: (element: string) => boolean
}

type BattleStartedEvent = {
    name: 'battle_started',
    payload: {
        teamA: RunedUnit[],
        teamB: RunedUnit[],
    }
}

type TurnStartedEvent = {
    name: 'turn_started',
    payload: {
        unit_id: string
    }
}

type TickEvent = {
    name: 'turn_started',
    payload: { [string]: number }
}

const eventHandlers = {
    battle_started(event: BattleStartedEvent) {
        this.units = [
            ...event.payload.teamA.map(contestant),
            ...event.payload.teamB.map(contestant)
        ].reduce((map, u) => {
            return {
                ...map,
                [u.id]: u,
            }
        }, {});
    },
    tick(event: TickEvent) {
        this.units = Object.values(this.units).reduce(
            (units, unit) => {
                return {
                    ...units,
                    [unit.id]: {
                        ...unit,
                        atb: unit.atb + event.payload[unit.id]
                    }
                }
            },
            {}
        );
    },
    turn_started(event: TurnStartedEvent) {
        const {unit_id} = event.payload;

        const unit = this.units[unit_id];

        this.unit = this.units[unit_id] = {
            ...unit,
            atb: 0
        };
    },
    turn_ended(event) {
        const deadUnits = Object.values(this.units).filter(u => u.hp === 0);
        deadUnits.forEach((u) => {
            causes.call(this, {
                name: 'unit_died',
                payload: {
                    unit_id: u.id,
                }
            })
        });
    },
    unit_died(event) {
        const players = Object.values(this.units)
            .filter(u => u.hp > 0)
            .map(u => u.player);

        this.units[event.payload.unit_id].atb = 0;

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
        this.winner = event.payload.winner;
    },
    skill_used(event) {
        // skill_id
        const {unit_id, skill_id} = event.payload;
        this.units[unit_id].cooldowns[skill_id] = this.units[unit_id].skills.find(s => s.id == skill_id).cooltime;
    },
    hit(event) {
        const target = this.units[event.payload.target];
        this.units[event.payload.target] = {
            ...target,
            hp: Math.max(0, target.hp - event.payload.damage),
        }
    },
    debuffed(event) {
        const target = this.units[event.payload.target];
        const {stat, value} = event.payload;
        this.units[event.payload.target] = {
            ...target,
            effects: [...target.effects, event.payload],
            [stat]: target[stat] - value,
        }
    }
};

function when(event) {
    const handler = eventHandlers[event.name];
    if (handler) {
        handler.call(this, event);
    } else {
        console.warn(`Can not handle event: ${event.name}`);
    }
}

function causes(event) {
    this.events.push(event);
    // this.mechanics.apply(m => m.handle(event));
    this.applyEvent(event);
}

const ATB_SIZE = 100;

function isReady(unit) {
    return unit.atb >= ATB_SIZE;
}

function byReadiness(uA: Contestant, uB: Contestant) {
    return uA.atb - uB.atb;
}

export class GuildWarBattle {
    units: Contestant[];
    unit: Contestant;
    winner: number;

    constructor(teamA: RunedUnit[], teamB: RunedUnit[]) {
        this.events = [];
        this.version = 0;
        const roll = () => _.random(1, 100);
        this.mechanics = new SkillSystem();
        this.mechanics.add(new EnemyDmgSystem(
            new HitStrategyFactory(roll),
            new Multiplier()
        ));
        this.mechanics.add(new HarmfulEffects(
            createResistPolicy(roll),
        ));
        // this.mechanics.add(new DefBreakSystem());
        // this.mechanics.add(new BufSystem());

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

        do {

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
                        unit_id: nextUnit.id,
                    }
                })
            }

        } while (!this.unit);
    }

    useSkill(player, skill_id, target_id) {
        if (this.unit.player !== player) {
            throw new Error('Cheater!!!');
        }

        causes.call(this, {
            name: 'skill_used',
            payload:{
                unit_id: this.unit.id,
                skill_id,
            }
        });

        const skill = this.unit.skills.find(skill => skill.id === skill_id);

        const events = this.mechanics.apply({
            caster: this.unit,
            target: this.units[target_id],
            battlefield: this.units,
            additional_dmg: skill.additional_dmg,
            additional_chance: skill.additional_chance,
        }, skill);

        events.forEach(causes.bind(this));

        causes.call(this, {
            name: 'turn_ended',
            payload:{
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
    // skill: Skill, // todo: add skill here
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

type Event = {
    name: string,
    payload: { [string]: any },
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
            return [...events, ...system.apply(context, step, events)];
        }, []);
    }
}


// battle started
// will runes buf applied
// shield runes buf applied
// fight runes effect applied
// molly's passive aura applied
