import {Battle} from "./battle";
import type {Ability, BaseUnit} from "./units";
import bernard from './units/bernard';
import slime from './units/slime';
import {SymfonyStyle} from 'symfony-style-console';
import Table from 'cli-table2';
import lushen from "./units/lushen";
import megan from "./units/megan";

const extra_stats = require('../stats.json');
import _ from 'lodash';
import praha from "./units/praha";
import bastet from "./units/bastet";
import perna from "./units/perna";
import psamathe from "./units/psamathe";


process.on('unhandledRejection', (reason, p) => {
    console.error({
        message: 'Unhandled Rejection',
        promise: p,
        reason,
    });
    process.exit();
});

process.on('uncaughtException', (err) => {
    console.error(err);
    process.exit();
});

type Action = {
    skill: number,
    target: number,
}

interface Player {
    id: number;

    requestAction(skills: Ability[], battle: Battle): Action;
}

type Stats = {
    hp?: number,
    atk?: number,
    def?: number,
    spd?: number,
    cr?: number,
    cd?: number,
    res?: number,
    acc?: number,
}

function createUnit(id, base, player_id, rune_sets, bonus_stats: Stats[] = []) {
    const stats = ['hp', 'atk', 'def', 'spd', 'cr', 'cd', 'res', 'acc'];
    const base_stats = stats.reduce((baseStats, name) => {
        return {
            ...baseStats,
            [`base_${name}`]: base[name],
        }
    }, {
        name: base.name,
        element: base.element,
        skills: base.skills,
    });

    return {
        id,
        player: player_id,
        // declare base stats
        ...base_stats,
        // todo: add runes stats calculations here
        ...stats.reduce((maxStats, name) => {
            return {
                ...maxStats,
                [`max_${name}`]: base[name] + _.sumBy(bonus_stats, s => s[name] || 0),
            }
        }, {}),
        rune_sets: rune_sets,
    }
}

const io = new SymfonyStyle();

const descriptions = {
    'Snatch': 'Attacks the enemy with razor-sharp claws. Damage increases accordingly to your Attack Speed.',
    'Body Slam': 'Attacks the enemy with a body slam and weakens their Attack Power and Defense for 2 turns.',
    'Tailwind': 'Increases the Attack Bar of all allies by 30%, and also increases their Attack Speed for 2 turns.',
};

function format_skill_description(skill) {
    if (skill.cooltime) {
        return `<options=bold>${skill.id}</>. ${descriptions[skill.id]} Reusable in ${skill.cooltime} turns.`;
    }
    return `<options=bold>${skill.id}</>. ${descriptions[skill.id]}`;
}


const target_strategies = {
    ally(battle) {
        return (unit) => {
            return unit.player === battle.unit.player;
        }
    },
    aoe_ally(battle) {
        return (unit) => {
            return unit.player === battle.unit.player;
        }
    },
    self(battle) {
        return (unit) => {
            return unit.id === battle.unit.id;
        }
    },
    not_self(battle) {
        return (unit) => {
            return battle.unit.player === unit.player && unit.id !== battle.unit.id;
        }
    },
    enemy(battle) {
        return (unit) => {
            return unit.player !== battle.unit.player;
        }
    },
    aoe_enemy(battle) {
        return (unit) => {
            return unit.player !== battle.unit.player;
        }
    },
};


const player: Player = {
    id: 1,
    async requestAction(skills: Ability[], battle: Battle): Action {

        io.section(`Current Unit ${battle.unit.name} of player ${battle.unit.player}`);

        const skillChoices = Object.keys(skills.filter(s => battle.unit.cooldowns[s.id] === 0))
            .reduce((choices, skill_idx) => {
                return {
                    ...choices,
                    [1 + 1 * skill_idx]: format_skill_description(skills[skill_idx]),
                }
            }, {});

        const skill_idx = await io.choice('Select skill', skillChoices);
        const skill = skills[skill_idx - 1];

        const valid_targets = Object.values(battle.units).filter(
            target_strategies[skill.target](battle)
        ).filter(t => t.hp);


        let target;
        if (skill.target.indexOf('aoe') === -1) {
            // single target skill
            const target_choices = Object.keys(valid_targets).reduce((choices, unit_idx) => {
                return {
                    ...choices,
                    [1 + 1 * unit_idx]: valid_targets[unit_idx].name,
                }
            }, {});
            const target_idx = await io.choice('Select target', target_choices);
            target = valid_targets[target_idx - 1];
        } else {
            if (skill.target.indexOf('enemy') !== -1) {
                target = valid_targets[0];
            } else {
                target = battle.unit
            }
        }

        return {
            skill: skill.id,
            target: target.id,
        }
    }
};

const ai: Player = {
    id: 2,
    requestAction(skills: Ability[], battle: Battle): Action {
        console.log('AI got a turn');

        return {
            skill: skills[0].id,
            target: "bastet",
        };
    }
};

const players = {
    [player.id]: player,
    [ai.id]: ai,
};


function windAttack30(unit: BaseUnit) {
    if (unit.element === 'wind') {
        return {
            atk: unit.atk * 0.3,
        }
    }
    return {};
}

const totems = [
    function (unit: BaseUnit) {
        return unit.def * 0.2;
        return {def: unit.def * 0.20};
    },
    function (unit: BaseUnit) {
        return {atk: unit.atk * 0.21};
    },
    function (unit: BaseUnit) {
        return {atk: unit.atk * 0.20};
    },
    function (unit: BaseUnit) {
        return {hp: unit.hp * 0.20};
    },
    function (unit: BaseUnit) {
        return {spd: unit.spd * 0.15};
    },
    function (unit: BaseUnit) {
        return {cd: 25};
    },
];

function fightSetBonus(unit: BaseUnit, numSets: number = 1) {
    return {atk: unit.atk * 0.08 * numSets};
}


const battle = new Battle(
    [
        createUnit('bernie', bernard, player.id, ['swift'], [
            extra_stats['bernie'],
            windAttack30(bernard),
            fightSetBonus(bernard, 2),
            ...totems.map(f => f(bernard)),
        ]),
        createUnit('bastet', bastet, player.id, ['swift'], [
            extra_stats['bastet'],
            windAttack30(bastet),
            fightSetBonus(bastet, 2),
            ...totems.map(f => f(bastet)),
        ]),
        createUnit('lushen1', lushen, player.id, ['fight', 'fight', 'will'], [
            extra_stats['lushen1'],
            windAttack30(lushen),
            fightSetBonus(lushen, 2),
            ...totems.map(f => f(lushen)),
        ]),
        createUnit('lushen2', lushen, player.id, ['rage', 'will'], [
            extra_stats['lushen2'],
            windAttack30(lushen),
            fightSetBonus(lushen, 2),
            ...totems.map(f => f(lushen)),
        ]),
    ],
    [
        createUnit('psam', psamathe, ai.id, ['nemezis', 'despair'], [extra_stats['psam']]),
        createUnit('praha', praha, ai.id, ['nemezis', 'nemezis', 'will'], [extra_stats['praha']]),
        createUnit('perna', perna, ai.id, ['violent'], [extra_stats['perna']]),
    ]
);

const BUFS = {
    'def_buf': 'D',
    'atk_buf': 'A',
    'haste': 'S',
    'hot': 'X',
    'anti_crit': 'C',
};

const DEBUFS = {
    'def_break': 'D',
    'atk_break': 'A',
    'speed_slow': 'S',
    'dot': 'X',
    'glancing': 'G',
    'unrecoverable': 'U',
    'block_buf': 'B',
};

function effect(e) {
    if (DEBUFS[e.effect] !== undefined) {
        return `${DEBUFS[e.effect]}-[${e.duration}]`;
    }
    return `${BUFS[e.effect]}+[${e.duration}]`;
}

function battleState(battle: Battle, player: Player) {
    const units = Object.values(battle.units).filter(u => u.player === player.id);
    return [
        units.map(u => u.name),
        [
            units.map(u => u.hp),
            units.map(u => u.atb.toFixed(0)),
            units.map(u => u.effects.map(e => effect(e)).join(',')),
        ]
    ];
}



(async () => {

    io.title('Battle Started');

    battle.dispatcher.on('.', console.log);

    while (!battle.ended) {
        battle.next();

        io.table(...battleState(battle, ai));
        io.table(...battleState(battle, player));

        const currentPlayer = players[battle.unit.player];

        const action = await currentPlayer.requestAction(
            battle.unit.skills,
            battle,
        );

        io.success(`Action: ${battle.unit.name} uses skill ${action.skill} on ${battle.units[action.target].name}`);

        battle.useSkill(currentPlayer.id, action.skill, action.target);

        const last_turn_events = battle.events.slice(
            battle.events.indexOf(battle.events.filter(e => e.name === 'turn_started').pop()),
        ).filter(e => !['turn_started', 'skill_used'].includes(e.name));

        io.listing(
            last_turn_events.map(e => `${e.name}: ${JSON.stringify(e.payload)}`),
        );
    }

    io.success(`Battle ended. Player ${battle.winner} won!`);
})();




