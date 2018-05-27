import {GuildWarBattle} from "./battle";
import type {Ability, BaseUnit} from "./units";
import bernard from './units/bernard';
import slime from './units/slime';
import {SymfonyStyle} from 'symfony-style-console';
import Table from 'cli-table2';

type Action = {
    skill: number,
    target: number,
}

interface Player {
    id: number;

    requestAction(skills: Ability[], battle: GuildWarBattle): Action;
}

class Unit {
    // todo: add skill ups ?
    constructor(id, owner: Player, base: BaseUnit, runes = []) {
        this.base = base;
        this.runes = runes;
    }
}

function createUnit(id, base, player_id) {
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
        ...stats.reduce((baseStats, name) => {
            return {
                ...baseStats,
                [`max_${name}`]: base[name],
            }
        }, {}),
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
    enemy(battle) {
        return (unit) => {
            return unit.player !== battle.unit.player;
        }
    },
};


const player: Player = {
    id: 1,
    async requestAction(skills: Ability[], battle: GuildWarBattle): Action {

        io.section(`Current Unit ${battle.unit.name} of player ${battle.unit.player}`);

        const skillChoices = Object.keys(skills).reduce((choices, skill_idx) => {
            return {
                ...choices,
                [1 + 1 * skill_idx]: format_skill_description(skills[skill_idx]),
            }
        }, {});

        const skill_idx = await io.choice('Select skill', skillChoices);
        const skill = skills[skill_idx - 1];

        const valid_targets = Object.values(battle.units).filter(
            target_strategies[skill.target](battle)
        );

        const target_choices = Object.keys(valid_targets).reduce((choices, unit_idx) => {
            return {
                ...choices,
                [1 + 1 * unit_idx]: valid_targets[unit_idx].name,
            }
        }, {});
        const target_idx = await io.choice('Select target', target_choices);
        const target = valid_targets[target_idx - 1];

        return {
            skill: skill.id,
            target: target.id,
        }
    }
};

const ai: Player = {
    id: 2,
    requestAction(actions): Action {
        console.log('AI got a turn');
        process.exit();
    }
};

const players = {
    [player.id]: player,
    [ai.id]: ai,
};

const battle = new GuildWarBattle(
    [createUnit(1, bernard, player.id)],
    [createUnit(2, slime, ai.id)]
);

const BUFS = {
    'def_buf': 'D',
    'atk_buf': 'A',
    'speed_buf': 'S',
    'hot': 'X',
    'anti_crit': 'C',
};

const DEBUFS = {
    'def_break': 'D',
    'atk_break': 'A',
    'speed_slow': 'S',
    'dot': 'X',
    'glancing': 'G',
};

function effect(e) {
    if (DEBUFS[e.effect] !== undefined) {
        return `${DEBUFS[e.effect]}-[${e.duration}]`;
    }
    return `${BUFS[e.effect]}+[${e.duration}]`;
}

function renderBattleState(battle: GuildWarBattle, player: Player) {
    const units = Object.values(battle.units).filter(u => u.player === player.id);
    const state = new Table({
        head: units.map(u => u.name),
        colWidths: new Array(units.length).fill(50),
    });

    state.push(
        units.map(u => u.hp / u.max_hp * 100),
        units.map(u => Math.min(u.atb, 100).toFixed(0)),
        units.map(u => u.effects.map(e => effect(e)).join(',')),
    );

    return state.toString();
}

(async () => {

    io.title('Battle Started');

    while (!battle.ended) {
        battle.next();

        io.section(`Player ${ai.id} team`);
        io.writeln(renderBattleState(battle, ai));
        io.section(`Player ${player.id} team`);
        io.writeln(renderBattleState(battle, player));

        const currentPlayer = players[battle.unit.player];

        const action = await currentPlayer.requestAction(
            battle.unit.skills,
            battle,
        );
        io.success(`Action: ${battle.unit.name} uses skill ${action.skill} on ${battle.units[action.target].name}`);

        battle.useSkill(currentPlayer.id, action.skill, action.target);
    }

    io.section(`Player ${ai.id} team`);
    io.writeln(renderBattleState(battle, ai));
    io.section(`Player ${player.id} team`);
    io.writeln(renderBattleState(battle, player));
    io.success(`Battle ended. Player ${battle.winner} won!`);

    console.log(battle.events);
})();




