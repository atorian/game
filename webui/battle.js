// @flow
import { Battle } from '../src/battle.js';
import Contestant from "../src/contestant";
import type { OwnedUnit, Unit } from "../src";
import { FIRE } from "../src";
import uuid from "uuid/v4";
import swunits from '../src/sw-units';

require('../src/sw-skills');

const battle = new Battle('some-id');

function playerTeam(units: { [string]: Unit }, player): OwnedUnit {
    let res = Array(Object.keys(units).length - 1);
    for (let id in units) {
        res.push({ ...units[id], id, player });
    }
    return res;
}

type Team = {
    player: string,
    units: { [string]: Unit },
};

function prepareTeam(units: Unit[]) {
    return units.reduce((carry, u) => {
        carry[uuid()] = u;
        return carry;
    }, {});
}

function displayTeam(units: { [string]: Unit }) {
    let res = {};
    for (let k in units) {
        const unit = units[k];
        res[k] = {
            id: unit.id,
            skills: unit.skills,
        };
    }
    return res;
}

// todo: map contestant to display info...
let teamA: Team = { player: 'player-1', units: prepareTeam([swunits["12302"]]) };
let teamB: Team = { player: 'player-2', units: prepareTeam([swunits["12302"]]) };

battle.start(
    playerTeam(teamA.units, teamA.player),
    playerTeam(teamB.units, teamB.player),
);

const battleView = {
    [teamA.player]: displayTeam(teamA.units),
    [teamB.player]: displayTeam(teamB.units),
};

const battles = {
    'some-id': battle,
};

const ASSETS_URL = 'https://swarfarm.com/static/herders/images/';

type UnitViewDetails = {
    name: string,
    icon: string,
}

const missingUnitViewDetails = {
    name: 'Missing Unit Name',
    icon: 'link to 404',
};

const Units = new Map();
Units.set(12302, {
    name: 'Forest Keeper',
    icon: 'monsters/unit_icon_0010_2_1.png',
});

const Skills = new Map();
const missingSkillViewDetails = {
    name: 'Missing Skill Name',
    icon: '',
    description: 'Missing Skill Description',
};

Skills.set(3602, {
    name: 'Splinter Attack',
    icon: 'skills/skill_icon_0003_5_7.png',
    description: 'Hurls sharp pieces of lumber and stuns the enemy with a 15% chance.',
});

const elColors = {
    [FIRE]: "#ff0000",
};

function interpretEvent(e) {
    const type = e.constructor.name;

    switch (type) {
        case 'BattleStarted':
            return "Battle Started";
        default:
            return `${e.constructor.name}: ${JSON.stringify(e, null, 2)}`;
    }
}

class BattleVM {
    battle;
    selectedSkill = null;

    constructor(battle: Battle) {
        this.battle = battle;
    }

    isStarted() {
        return this.battle.started === true;
    }

    getTeam(player: string) {
        let res = [];
        for (let k in battleView[player]) {
            res.push({
                ...battleView[player][k],
                ...this.battle.units[k],
                id: battleView[player][k].id,
            });
        }
        return res;
    }

    get teamA() {
        return this.getTeam(teamA.player);
    }

    get teamB() {
        return this.getTeam(teamB.player);
    }

    get events() {
        return this.battle.events.map(interpretEvent);
    }
}


class SkillView extends HTMLElement {
    skill;
    maxCd: number;
    cd: number;

    constructor() {
        super();
        const skillId = parseInt(this.getAttribute('skill-id'), 10);
        if (!skillId) throw new Error('skill-id argument is required!');
        this.skill = Skills.get(skillId) || missingSkillViewDetails;
        this.maxCd = parseInt(this.getAttribute('max-cooldown'), 10) || 0;
        this.cd = parseInt(this.getAttribute('cooldown'), 10) || 0;
        if (this.isOnCooldown()) {
            this.disable();
        }
    }

    isOnCooldown() {
        return this.cd > 0;
    }

    enable() {
        this.removeAttribute('disabled');
    }

    disable() {
        this.setAttribute('disabled', 'disabled');
    }

    connectedCallback() {
        this.innerHTML = `<div class="skill" style="width: 40px;">
            <img style="display: block; width: 100%;" 
                 src="${ASSETS_URL}${this.skill.icon}" />
            <p class="tooltip">${this.skill.description}</p>
            <div style="position: absolute; top:0; left:0; background-color: black; opacity: 0.5; width: 100%; height: ${this.cd / this.maxCd * 100}%"></div>
        </div>`;
    }
}

customElements.define('x-skill', SkillView);

class ContestantView extends HTMLElement {
    unit;

    constructor(unit: Contestant) {
        super();
        this.unit = unit;
        this.style.cssText = 'display: block; width: 120px; overflow: scroll;';
        this.className = 'contestant';
    }

    connectedCallback() {
        const u: UnitViewDetails = Units.get(this.unit.id) || missingUnitViewDetails;

        const hpP = Math.floor(this.unit.currentHP / this.unit.hp * 100);
        this.innerHTML = `
            <style> 
                .stats .dl {
                    display: none;
                }
                .stats:hover dl {
                    display: block;
                }
                .stats:hover .unit-icon {
                    display: none;
                }
                .stats {
                    margin: 0;
                    width: 120px;
                    height: 120px;
                    overflow: hidden;
                    font-size: 12px;
                    line-height: 1.3;
                }
                .stats dt {
                    width: 50px;
                    float: left;
                } 
                .stats dd {
                    margin: 0;
                } 
            </style> 
            <div style="position: relative; text-align: center; line-height: 20px; color: black;">
                ${this.unit.currentHP} [${hpP}%]
                <div style="position: absolute; z-index:-1; top:0; left:0; height: 20px; width: ${hpP}%; background-color: green;"></div>
            </div>    
            <div style="position: relative; text-align: center; line-height: 8px; color: black; font-size: 8px;">
                ${this.unit.atb}
                <div style="position: absolute; z-index:-1; top:0; left:0; height: 8px; width: ${Math.min(this.unit.atb, 100)}%; background-color: yellow;"></div>
            </div>   
         
            <dl class="stats">
                <img src="${ASSETS_URL}${u.icon}" alt="${u.name}" class="unit-icon" style="width: 100%;">
                <dt>HP</dt><dd>${this.unit.hp}</dd>
                <dt>ATK</dt><dd>${this.unit.atk}</dd>
                <dt>DEF</dt><dd>${this.unit.def}</dd>
                <dt>SPD</dt><dd>${this.unit.spd}</dd>
                <dt>CR</dt><dd>${this.unit.cr}</dd>
                <dt>CD</dt><dd>${this.unit.cd}</dd>
                <dt>RES</dt><dd>${this.unit.res}</dd>
                <dt>ACC</dt><dd>${this.unit.acc}</dd>
            </dl>
            
            <div class="skills">
                ${this.unit.skills.map(s => `<x-skill 
                    skill-id="${s.id}" 
                    max-cooldown="${s.maxCooldown}" 
                    cooldown="${s.cooldown}"/>`)}                
            </div>
        `;
    }
}

customElements.define('x-contestant', ContestantView);

// class TeamView extends HTMLElement {
//     team;
//
//     constructor(team) {
//         super();
//         this.team = team;
//     }
//
//     connectedCallback() {
//         this.;
//     }
// }
//
// customElements.define('x-team', TeamView);


class BattleLog extends HTMLElement {
    battle: BattleVM;

    constructor(battle) {
        super();
        this.battle = battle;
        this.style.cssText = 'height: 200px; overflow-y: auto;';
    }

    connectedCallback() {
        this.innerHTML = `<ul>
            ${this.battle.events.map(event => `<li>${event}</li>`)}
        </ul>`
    }
}

customElements.define('x-battle-log', BattleLog);

class GuildBattleView extends HTMLElement {
    _battle;

    constructor() {
        super();
        const battleId = this.getAttribute('battle_id');
        if (!battleId) {
            throw new Error('battle_id prop is required');
        }
        const battle = battles[battleId];
        if (!battle) {
            throw new Error('Unknown Battle! WTF?');
        }
        this._battle = new BattleVM(battle);
    }

    _renderTeam(team) {
        const container = document.createElement("div");
        team.map(u => new ContestantView(u)).forEach(c => container.appendChild(c));
        return container;
    }

    connectedCallback() {
        if (this._battle.isStarted()) {
            let tA = this._battle.teamA;
            this.appendChild(this._renderTeam(tA));
            this.appendChild(new BattleLog(this._battle));
            let tB = this._battle.teamB;
            this.appendChild(this._renderTeam(tB));
        } else {
            this.innerHTML = `<div>Battle is not jet Started</div>`;
        }

    }
}

customElements.define('x-battle', GuildBattleView);

const container = document.getElementById("battle");
if (container) {
    container.innerHTML = '<x-battle battle_id="some-id"/>';
} else {
    alert(`Container element with ID=${battle} missing in the DOM`)
}
