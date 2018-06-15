import _ from 'lodash';
import type {BaseUnit, BattleType, RuneSet} from "./domain";
import * as units from './units';
import {Battle} from "./domain/battle";
import {Player} from "./domain/player";

type PreparingUnit = {
    family: string, // monster family name
    hp: number,
    atk: number,
    def: number,
    spd: number,
    cr: number,
    cd: number,
    res: number,
    acc: number,
    rune_sets: RuneSet[]
}

export default class TeamBuilder {

    slots: PreparingUnit[];
    type: BattleType;
    player: Player;

    constructor(player: Player, type) {
        this.player = player;
        this.type = type;

        const size = {
            arena: 4,
            guild_battle: 3,
            dungeon: 5,
            rift: 6,
        }[type];

        this.slots = new Array(size).fill(null);
    }

    get members() {
        return this.slots.filter(m=>m);
    }

    get size() {
        return this.members.length;
    }

    static guildBattle(player) {
        return new TeamBuilder(player, 'guild_battle');
    }

    static arenaBattle(player) {
        return new TeamBuilder(player, 'arena');
    }

    static dungeonBattle(player) {
        return new TeamBuilder(player, 'dungeon');
    }

    static riftBattle(player) {
        return new TeamBuilder(player, 'rift');
    }

    moveUnit(unit: PreparingUnit, newIdx) {
        const oldIdx = this.slots.indexOf(unit);
        if (!this.slots[newIdx]) {
            this.slots[newIdx] = this.slots[oldIdx];
            this.slots[oldIdx] = null;
        } else {
            const otherUnit = this.slots[newIdx];
            this.slots[newIdx] = this.slots[oldIdx];
            this.slots[oldIdx] = otherUnit;
        }
    }

    addUnit(unit: PreparingUnit) {
        for (const slot in this.slots) {
            if (!this.slots[slot]) {
                this.slots[slot] = unit;
                return;
            }
        }

        throw new Error('All of your slots are full.');
    }

    removeUnit(idx) {
        this.slots[idx] = null
    }
}

function applyRunes(unit: PreparingUnit) {
    return (base: BaseUnit) => {
        const {family, ...extra_stats} = unit;
        return extra_stats;
    }
}

function applyTotems(player) {
    return (base: BaseUnit) => {
        return player.arena_totems.reduce((stats, totem) => {
            if (totem.stat === 'cd') {
                return {
                    ...stats,
                    [totem.stat]: totem.value,
                }
            } else if (['atk_wind', 'atk_water', 'atk_dark', 'atk_light', 'atk_fire'].includes(totem.stat)) {
                if (totem.name === `atk_${base.element}`) {
                    return {
                        ...stats,
                        atk: 1 * (base.atk * totem.value).toFixed(0) + stats.atk,
                    }
                }
                return stats;
            }

            return {
                ...stats,
                [totem.stat]: stats[totem.stat] + 1 * (base[totem.stat] * totem.value).toFixed(0),
            }

        }, {atk: 0, def: 0, hp: 0, spd: 0, cd: 0});
    }
}

function applyLeaderSkill(leader: BaseUnit, type: string) {
    return (unit: BaseUnit) => {
        const {leader_ability} = leader;

        if (leader_ability) {
            let applies_to_battle = true;
            if (leader_ability.battle_type && type !== leader_ability.battle_type) {
                applies_to_battle = false;
            }

            let applies_to_element = true;
            if (leader_ability.element && unit.element !== leader_ability.element) {
                applies_to_element = false;
            }

            if (applies_to_battle && applies_to_element) {
                if (['atk', 'hp', 'def', 'spd'].includes(leader_ability.stat)) {
                    return {
                        [leader_ability.stat]: unit[leader_ability.stat] * leader_ability.value,
                    }
                } else {
                    return {
                        [leader_ability.stat]: leader_ability.value,
                    }
                }
            }
        }

        return {};
    }
}

function applyFightRunes(builder: TeamBuilder) {
    return (unit: BaseUnit) => {
        const multiplier = builder.members.reduce((rune_sets, u) => [...rune_sets, u.rune_sets], [])
            .filter(s => s === 'fight')
            .length;

        return {
            atk: multiplier * 0.08 * unit.atk,
        }
    }
}

function applyDeterminationRunes(builder: TeamBuilder) {
    return (unit: BaseUnit) => {
        const multiplier = builder.members.reduce((rune_sets, u) => [...rune_sets, u.rune_sets], [])
            .filter(s => s === 'determination')
            .length;

        return {
            def: multiplier * 0.08 * unit.def,
        }
    }
}

function applyAccuracyRunes(builder: TeamBuilder) {
    return (unit: BaseUnit) => {
        const multiplier = builder.members.reduce((rune_sets, u) => [...rune_sets, u.rune_sets], [])
            .filter(s => s === 'accuracy')
            .length;

        return {
            acc: multiplier * 10,
        }
    }
}

function applyToleranceRunes(builder: TeamBuilder) {
    return (unit: BaseUnit) => {
        const multiplier = builder.members.reduce((rune_sets, u) => [...rune_sets, u.rune_sets], [])
            .filter(s => s === 'accuracy')
            .length;

        return {
            res: multiplier * 10,
        }
    }
}

function applyEnhanceRunes(builder: TeamBuilder) {
    return (unit: BaseUnit) => {
        const multiplier = builder.members
            .reduce((rune_sets, u) => [...rune_sets, u.rune_sets], [])
            .filter(s => s === 'enhance')
            .length;

        return {
            hp: multiplier * 0.08 * unit.hp,
        }
    }
}

function prepareForBattle(team: TeamBuilder) {
    return (unit: PreparingUnit) => {
        const baseUnit: BaseUnit = units[unit.family];

        return [
            applyRunes(unit),
            applyTotems(team.player),
            applyLeaderSkill(units[team.slots[0].family], team.type),
            applyFightRunes(team),
            applyDeterminationRunes(team),
            applyAccuracyRunes(team),
            applyToleranceRunes(team),
            applyEnhanceRunes(team),
        ].map(f => f(baseUnit))
            .reduce((finalStats, additional_stats) => {
                return Object.keys(additional_stats).reduce((accumulated, stat) => {
                    if (stat === 'rune_sets') {
                        return {
                            ...accumulated,
                            rune_sets: additional_stats.rune_sets,
                        }
                    }

                    return {
                        ...accumulated,
                        [stat]: finalStats[stat] + additional_stats[stat],
                    }
                }, finalStats);
            }, {
                id: `${baseUnit.name}-${team.player.id}-${_.uniqueId()}`,
                player: team.player.id,
                ...baseUnit,
            });
    }
}

export function startBattle(teamA: TeamBuilder, teamB: TeamBuilder) {
    if (!teamA || !teamB || teamA.size === 0 || teamB.size === 0) {
        throw new Error([
            'Can not start battle without second team.',
            `TeamA members ${teamA.size}.`,
            `TeamB members ${teamB.size}.`
        ].join('\n'));
    }

    const teamA_members = teamA.members.map(prepareForBattle(teamA));
    const teamB_members = teamB.members.map(prepareForBattle(teamB));

    return new Battle(teamA_members, teamB_members);
}
