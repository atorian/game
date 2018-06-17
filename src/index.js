import _ from 'lodash';
import {Battle} from "./domain/battle";
import {SymfonyStyle} from 'symfony-style-console';
import type {Ability} from "./domain";
import TeamBuilder, {startBattle} from "./domain/battle_preparation";

const presets = require('../stats.json');


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
    arena_totems: [
        {stat: 'atk', value: 0.2},
        {stat: 'atk_fire', value: 0.21},
        {stat: 'atk_wind', value: 0.21},
        {stat: 'atk_water', value: 0.21},
        {stat: 'atk_light', value: 0.21},
        {stat: 'atk_dark', value: 0.21},
        {stat: 'def', value: 0.2},
        {stat: 'hp', value: 0.2},
        {stat: 'spd', value: 0.15},
        {stat: 'cd', value: 25},
    ],
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
    arena_totems: [
        {stat: 'atk', value: 0.2},
        {stat: 'atk_fire', value: 0.21},
        {stat: 'atk_wind', value: 0.21},
        {stat: 'atk_water', value: 0.21},
        {stat: 'def', value: 0.2},
        {stat: 'hp', value: 0.2},
        {stat: 'spd', value: 0.15},
        {stat: 'cd', value: 25},
    ],
    requestAction(skills: Ability[], battle: Battle): Action {
        console.log('AI got a turn');

        const target = _.sample(
            Object.values(battle.units)
                .filter(u => u.player !== this.id)
        );

        return {
            skill: skills[0].id,
            target: target.id,
        };
    }
};

const players = {
    [player.id]: player,
    [ai.id]: ai,
};

const BUFS = {
    'def_buf': 'D',
    'atk_buf': 'A',
    'haste': 'F',
    'hot': 'T',
    'anti_crit': 'C',
    'shield': 'O',
    'rune_shield': 'R',
};

const DEBUFS = {
    'def_break': 'D',
    'atk_break': 'A',
    'slow': 'S',
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

    const teamA = TeamBuilder.arenaBattle(player);
    teamA.addUnit(presets['bernie']);
    teamA.addUnit(presets['bastet']);
    teamA.addUnit(presets['lushen1']);
    teamA.addUnit(presets['lushen2']);

    const teamB = TeamBuilder.arenaBattle(ai);
    teamB.addUnit(presets['psam']);
    teamB.addUnit(presets['praha']);
    teamB.addUnit(presets['perna']);
    teamB.addUnit(presets['ritesh']);

    const battle = startBattle(teamA, teamB);

    io.title('Battle Started');

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




