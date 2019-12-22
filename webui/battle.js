// @flow
import uuid from "uuid/v4";
import type { OwnedUnit, Unit } from "../src";
import { FIRE } from "../src";
import { Battle } from '../src/battle.js';
import swunits from '../src/sw-units';

require('../src/sw-skills');

const battle = new Battle('some-id');

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


const uiTargetEnemy = Symbol('enemy');
const uiTargetSelf = Symbol('self');
const uiTargetAlly = Symbol('ally');
const uiTargetAllies = Symbol('allies');

Skills.set(3602, {
    name: 'Splinter Attack',
    icon: 'skills/skill_icon_0003_5_7.png',
    description: 'Hurls sharp pieces of lumber and stuns the enemy with a 15% chance.',
    target: uiTargetEnemy,
});

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
            ...Units.get(unit.id),
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


const elColors = {
    [FIRE]: "#ff0000",
};

function interpretEvent(e) {
    const type = e.constructor.name;

    switch (type) {
        case 'BattleStarted':
            return "Battle Started";
        case 'Tick':
            return null;
        case 'GloryTowersApplied':
            const { id, ...rest } = e;
            if (Object.keys(rest).length > 0) {
                return `${e.constructor.name}: ${JSON.stringify(e, null, 2)}`;
            }
            return null;
        case 'TurnStarted':
            const player = battle.units[e.id].player;
            const unit = battleView[player][e.id];
            return `${unit.name} of ${player} starts turn`;
        default:
            return `${e.constructor.name}: ${JSON.stringify(e, null, 2)}`;
    }
}

type effectVM = {
    id: number,
    duration: number
}

type SkillVM = {
    id: string,
    cooldown: number,
    name: string,
    icon: string,
    description: string,
}

class ContestantVM {
    id: string;
    icon: string;
    name: string;

    atb: number = 0;
    currentHP: number;
    destroyedHP: number;

    hp: number;
    atk: number;
    def: number;
    spd: number;
    cr: number;
    cd: number;
    acc: number;
    res: number;

    effects: effectVM[];
    skills: SkillVM[];

    isCurrent: boolean;
    isTarget: boolean;

    constructor(battleData, displayData, isCurrent, isTarget) {
        Object.assign(this, displayData, battleData, {
            isCurrent,
            isTarget,
            effects: battleData.effects.elements.filter(e => e.duration),
            skills: battleData.skills.map(s => ({
                id: s.id,
                cooldown: s.cooldown,
                ...Skills.get(s.id),
            }))
        });
    }
}

// 1 big model for the whole battle,
// a place where we merge data from different services
function isTarget(skill, caster, unit) {
    if (!(skill && caster)) return false;

    if (skill.target === uiTargetEnemy) {
        return caster.player !== unit.player;
    }
    if (skill.target === uiTargetAllies) {
        return caster.player === unit.player;
    }
    if (skill.target === uiTargetAlly) {
        return caster.player === unit.player && caster.id !== unit.id;
    }
    if (skill.target === uiTargetSelf) {
        return caster.id === unit.id;
    }

    return false;
}

// todo: should be an event dispatcher & trigger rerender
class BattleVM {
    battle;
    _selectedSkill;
    winnerText: string;

    constructor(battleId: string) {
        this.battle = battles[battleId];
        if (!this.battle.current) {
            setTimeout(() => {
                this.battle.next();
                this.changed();
            }, 500);
        }
    }

    changed: () => void;

    onChange(callback) {
        this.changed = () => {
            callback();

            if (!this.battle.current && !this.winnerText) {
                setTimeout(() => {
                    if (this.battle.ended) {
                        this.winnerText = this.battle.winner === 'player-1' ? 'VICTORY' : 'LOOSE';
                    } else {
                        this.battle.next();
                    }
                    this.changed();
                }, 500);
            }
        }
    }

    isStarted() {
        return this.battle.started === true;
    }

    castSkillOn(targetId) {
        // todo: change view behaviour to save not skill id, but it's position in the box
        let skill = this.battle.current.skills.find(s => s.id === this._selectedSkill.id);
        this.battle.cast(this.battle.current.skills.indexOf(skill), targetId);
        this.changed();
    }

    selectSkill(skillId) {
        this._selectedSkill = {
            ...this.battle.current.skills.find(skill => skill.id === skillId),
            ...Skills.get(skillId),
        };
        this.changed();
    }

    get selectedSkill() {
        if (!this._selectedSkill && this.battle.current) {
            this._selectedSkill = {
                ...this.battle.current.skills[0],
                ...Skills.get(this.battle.current.skills[0].id),
            };
        }
        return this._selectedSkill;
    }

    get availableSkills() {
        if (!this.battle.current) return [];
        const skills = this.battle.current.skills.map(s => ({
            id: s.id,
            cooldown: s.cooldown,
            ...Skills.get(s.id),
        }));

        return skills;
    }

    getTeam(player: string) {
        let res = [];
        for (let k in battleView[player]) {
            res.push(
                new ContestantVM(
                    this.battle.units[k],
                    battleView[player][k],
                    this.battle.current && this.battle.current.id === k,
                    isTarget(this.selectedSkill, this.battle.current, this.battle.units[k])
                )
            );
        }
        return res;
    }

    contestant(player: string, unitId): ContestantVM {
        return new ContestantVM(
            this.battle.units[unitId],
            battleView[player][unitId],
            this.battle.current && this.battle.current.id === unitId,
            isTarget(this.selectedSkill, this.battle.current, this.battle.units[unitId])
        );
    }

    get teamA() {
        return this.getTeam(teamA.player);
    }

    get teamB() {
        return this.getTeam(teamB.player);
    }

    get log(): string[] {
        return this.battle.events.map(interpretEvent).filter(e => e);
    }
}

class SkillView extends HTMLElement {
    skill: SkillVM;

    constructor(skillVM: SkillVM) {
        super();
        this.skill = skillVM;
        this.style.display = 'inline-block';
        this.style.width = '40px';
    }

    connectedCallback() {
        this.innerHTML = `
        <style>
            .skill {
                line-height: 40px;
                vertical-align: middle;
                text-align: center;
                width: 40px;
                height: 40px;
                position: relative;
                overflow: visible;
                border-radius: 5px;
                border: 2px solid ghostwhite;
                background-size: 40px 40px !important;
                box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.75),
                 inset 0px 0px 3px 1px rgba(255,255,255,0.75);
            }
            .skill-${this.skill.id} {
                background: #000 url(${ASSETS_URL}${this.skill.icon}) no-repeat center;
            }
        </style>
        <div class="skill skill-${this.skill.id}">
            ${this.skill.cooldown > 0 ? `<div>${this.skill.cooldown}</div>` : ''}
        </div>`;
    }
}

customElements.define('x-skill', SkillView);

class AttackBar extends HTMLElement {
    constructor() {
        super();
        this.style.cssText = "display: block; width: 100%; height 10px; position: relative; text-align: center; line-height: 10px; color: black; font-size: 10px;"
        this.root = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        const atb = 1 * this.getAttribute('value') || 0;
        this.root.innerHTML = `
            ${atb}
            <div style="position: absolute; z-index:-1; top:0; left:0; height: 100%; width: ${Math.min(atb, 100)}%; background-color: deepskyblue;"></div>
        `
    }

    connectedCallback() {
        this.render();
    }
}

customElements.define('x-atb', AttackBar);

class HPBar extends HTMLElement {
    constructor() {
        super();
        this.style.cssText = "position: relative; display: block; text-align: center; line-height: 20px; height: 20px; color: black; background-color: gray;";
        this.root = this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['current', 'destroyed', 'max'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }

    render() {
        const max = 1 * this.getAttribute('max') || 0;
        const current = 1 * this.getAttribute('current') || 0;
        const destroyed = 1 * this.getAttribute('destroyed') || 0;
        const hpP = Math.floor(current / (max - destroyed) * 100);
        const destroyedP = Math.floor(destroyed / max * 100);
        this.root.innerHTML = `
            <style>
            :host div {
                position: absolute;
            }
            :host .value {
                display: none;
                width: 100%;
                height: 100%;
                color: white;
                z-index: 1;
                font-family: 'Helvetica, Arial';
                text-align: center;
                vertical-align: middle;
            }
            :host(:hover) .value {
                display: block;
            }
            </style>
            <div style="position: absolute; z-index: 0; top:0; left:0; height: 100%; width: ${hpP}%; background-color: green;"></div>
            <div style="position: absolute; top:0; right:0; height: 100%; width: ${destroyedP}%; background-color: red;"></div>
            <div class="value">${Math.floor(current / (max - destroyed) * 100)}%</div>
        `
    }

    connectedCallback() {
        this.render();
    }
}

customElements.define('x-hp-bar', HPBar);


class ContestantView extends HTMLElement {
    unit: ContestantVM;

    constructor(unit: ContestantVM) {
        super();
        this.unit = unit;
        this.style.cssText = 'display: block; width: 120px;';
    }

    update(unit: ContestantVM) {
        this.unit = unit;

        if (this.unit.isCurrent) {
            this.style.backgroundColor = 'snow';
        }

        if (this.unit.isTarget) {
            this.setAttribute('target', '')
        } else {
            this.removeAttribute('target');
        }


        this.querySelector('x-atb').setAttribute('value', this.unit.atb);
        let hpBar = this.querySelector('x-hp-bar');
        hpBar.setAttribute('max', this.unit.hp);
        hpBar.setAttribute('current', this.unit.currentHP);
        // todo: update destroyed hp

        ['hp', 'atk', 'def', 'spd', 'cr', 'cd', 'acc', 'res'].forEach(stat => {
            this.querySelector(`[data-stat="${stat}"]`).innerText = this.unit[stat];
        });
        // todo: update skill cooldowns
        console.log('c events', this.unit.effects);
        this.querySelector('.effects').innerHTML = this.unit.effects.map(effect => `<li class="effect effect-${effect.name}">${effect.duration}</li>`).join('')
    }

    showStats() {
        this.querySelector('.stats').removeAttribute('hidden');
        this.querySelector('.icon').setAttribute('hidden', '');
    }

    hideStats() {
        this.querySelector('.stats').setAttribute('hidden', '');
        this.querySelector('.icon').removeAttribute('hidden');
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                x-contestant[target]:hover {
                    cursor: pointer;
                }
                x-contestant[target] .targetable{
                    animation-name: blink;
                    animation-duration: 1.5s;
                    animation-iteration-count: infinite;
                    box-shadow: 0 0 10px 0 red;
                }
                x-contestant .info {
                    display: block;
                    position:absolute;
                    bottom: 0;
                    right: 0;
                    width: 15px;
                    height: 15px;
                    background: royalblue;
                    color: white;
                    text-align: center;
                    font-font: Helvetica, Arial;
                    font-weight: bold;
                }
                .stats .dl {
                    display: none;
                }
                .stats {
                    margin: 0;
                    width: 120px;
                    height: 120px;
                    overflow: hidden;
                    font-size: 12px;
                    line-height: 1.3;
                    position:relative;
                }
                .stats dt {
                    width: 50px;
                    float: left;
                }
                .stats dd {
                    margin: 0;
                }
                .icon {
                    letter-spacing: 0;
                    margin: 0;
                    padding: 0;
                    height: 120px;
                    position:relative;
                }
                .icon .effects {
                    margin: 0;
                    padding: 0;
                    position: absolute;
                    top: 0;
                    letter-spacing: 0;
                }
                .icon .effect {
                    display: inline-block;
                    background: red;
                    width: 30px;
                    height: 30px;
                    line-height: 40px;
                    vertical-align: bottom;
                    text-align: right;
                    color: yellow;
                    font-family: Helvetica, Arial;
                    font-weight: bold;
                    font-size: 20px;
                    -webkit-text-stroke: 1px black;
                }
                .effect.effect-stun {
                    background: url("https://swarfarm.com/static/herders/images/buffs/debuff_stun.png") no-repeat;
                    background-size: 30px 30px;
                }
                
            </style>
            <div class="targetable">
                <x-hp-bar max="${this.unit.hp}" current="${this.unit.currentHP}" destroyed="0" ></x-hp-bar>
                <x-atb value="${this.unit.atb}"></x-atb>
                <div class="icon">
                    <ul class="effects">${this.unit.effects.map(effect => `<li class="effect effect-${effect.name}">${effect.duration}</li>`).join('')}</ul>
                    <img src="${ASSETS_URL}${this.unit.icon}" alt="${this.unit.name}" class="unit-icon" style="width: 100%;">
                </div>
                <dl class="stats" hidden>
                    <dt>HP</dt><dd data-stat="hp">${this.unit.hp}</dd>
                    <dt>ATK</dt><dd data-stat="atk">${this.unit.atk}</dd>
                    <dt>DEF</dt><dd data-stat="def">${this.unit.def}</dd>
                    <dt>SPD</dt><dd data-stat="spd">${this.unit.spd}</dd>
                    <dt>CR</dt><dd data-stat="cr">${this.unit.cr}</dd>
                    <dt>CD</dt><dd data-stat="cd">${this.unit.cd}</dd>
                    <dt>RES</dt><dd data-stat="res">${this.unit.res}</dd>
                    <dt>ACC</dt><dd data-stat="acc">${this.unit.acc}</dd>
                </dl>
                <div class="info">i</div>
            </div>
        `;

        const infoIcon = this.querySelector('.info');

        infoIcon.onmouseover = () => this.showStats();
        infoIcon.onmouseout = () => this.hideStats();

        const skills = document.createElement('div');
        skills.className = "skills";
        skills.style.marginTop = '3px';
        // todo: revisit this
        for (const skill of this.unit.skills) {
            skills.appendChild(new SkillView(skill));
        }

        this.appendChild(skills);
    }
}

customElements.define('x-contestant', ContestantView);

class GuildBattleView extends HTMLElement {
    _battle: BattleVM;
    teamA: HTMLElement; // sub view
    teamB: HTMLElement; // sub view
    battleLog: HTMLTextAreaElement;  // sub view
    info: HTMLElement;  // sub view
    availableSkills: HTMLElement;

    constructor(battleVM) {
        super();
        this._battle = battleVM;
        this.teamA = this._renderTeam('player-1', (this._battle.teamA));
        this.teamB = this._renderTeam('player-2', (this._battle.teamB));

        this.info = document.createElement('p');
        this.info.style.cssText = 'height: 200px; overflow-y: scroll; marging: 0;';
        this.info.setAttribute('hidden', '');

        this._battle.onChange(() => this.update())
    }

    update() {
        this.battleLog.value = this._battle.log.join('\n');
        this.battleLog.scrollTop = this.battleLog.scrollHeight;

        const contestants = this.querySelectorAll('x-contestant');
        contestants.forEach((c: ContestantView) => c.onclick = null);

        for (let player of ['player-1', 'player-2']) {
            this.querySelectorAll(`[data-team="${player}"] x-contestant`).forEach(cv => {
                cv.update(this._battle.contestant(player, cv.unit.id));
            });
        }

        const targets = this.querySelectorAll('x-contestant[target]');
        targets.forEach(t => t.onclick = () => this._battle.castSkillOn(t.unit.id));

        this.availableSkills.innerHTML = '';
        for (const skill of this._battle.availableSkills) {
            let skillView = new SkillView(skill);
            if (skill.id === this._battle.selectedSkill.id) {
                skillView.className = 'selected';
            }
            skillView.onclick = () => this._battle.selectSkill(skill.id);
            this.availableSkills.appendChild(skillView);
        }

        if (this._battle.winnerText) {
            this.info.textContent = this._battle.winnerText;
            this.info.removeAttribute('hidden');
            this.info.style.fontSize = '90px';
            this.info.style.color = 'red';
            this.info.style.margin = '0';
            this.info.style.height = '120px';
            this.querySelector('.container').scrollTop = 300;
            this.querySelectorAll('x-skill').forEach((s: SkillView) => {
                s.onmouseover = null;
                s.onmouseout = null;
            });
        } else {
            let skills = this.querySelectorAll('.available-skills x-skill');
            skills.forEach((s: SkillView) => {
                s.onmouseover = () => this._showSkillInfo(s.skill);
                s.onmouseout = this._showBattleLog.bind(this);
            });
        }
    }

    _renderTeam(player, team) {
        const container = document.createElement("div");
        container.setAttribute('data-team', player);
        container.innerHTML = '';
        for (const u of team) {
            container.appendChild(new ContestantView(u));
        }
        return container;
    }

    _showSkillInfo(skill: SkillVM) {
        this.battleLog.setAttribute('hidden', '');
        this.info.removeAttribute('hidden');
        this.info.textContent = skill.description;
    }

    _showBattleLog() {
        this.info.setAttribute('hidden', '');
        this.info.textContent = '';
        this.battleLog.removeAttribute('hidden');
    }

    connectedCallback() {
        if (this._battle.isStarted()) {
            this.battleLog = document.createElement('textarea');
            this.battleLog.style.height = '200px';
            this.battleLog.style.width = '100%';
            this.battleLog.style.border = 'none';
            this.battleLog.style.padding = '0';

            this.battleLog.value = this._battle.log.join('\n');
            this.battleLog.scrollTop = this.battleLog.scrollHeight;

            let container = document.createElement('div');
            container.className = "container";
            container.style.cssText = 'height: 200px; overflow-y: auto; width: 400px';
            this.appendChild(this.teamB);
            container.appendChild(this.battleLog);
            container.appendChild(this.info);
            this.appendChild(container);
            this.appendChild(this.teamA);

            let skills = this.querySelectorAll('x-skill');
            skills.forEach((s: SkillView) => {
                s.onmouseover = () => this._showSkillInfo(s.skill);
                s.onmouseout = this._showBattleLog.bind(this);
            });

            this.availableSkills = document.createElement('ul');
            this.availableSkills.className = "available-skills";

            this.styles = document.createElement('style');
            this.styles.innerHTML = `
                .skill {
                    line-height: 40px;
                    vertical-align: middle;
                    text-align: center;
                    width: 40px;
                    height: 40px;
                    position: relative;
                    overflow: visible;
                    border-radius: 5px;
                    border: 2px solid ghostwhite;
                    box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.75),
                     inset 0px 0px 3px 1px rgba(255,255,255,0.75);
                    background-size: 40px 40px !important;
                }
                .selected .skill {
                    animation-name: blink;
                    animation-duration: 1.5s;
                    animation-iteration-count: infinite;
                }
                @keyframes blink {
                    0%   {
                        filter: brightness(1);
                        -webkit-filter: brightness(1);
                    }
                    50%  {
                        filter: brightness(1.3);
                        -webkit-filter: brightness(1.3);
                    }
                    100% {
                        filter: brightness(1);
                        -webkit-filter: brightness(1);
                    }
                }
                .available-skills .skill:active {
                    animation-name: scale;
                    transform-origin: center center;
                    animation-duration: 0.3s;
                }
                @keyframes scale {
                    0%   {
                        transform: scale(1);
                    }
                    50%  {
                        transform: scale(0.8);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `;
            this.appendChild(this.styles);
            for (const skill in this._battle.availableSkills) {
                this.availableSkills.appendChild(new SkillView(skill));
            }
            this.appendChild(this.availableSkills);

        } else {
            this.innerHTML = `<div>Battle is not jet Started</div>`;
        }
    }
}

customElements.define('x-battle', GuildBattleView);

const container = document.getElementById("battle");
if (container) {
    let battleVM = new BattleVM('some-id');
    let battleView = new GuildBattleView(battleVM);
    container.appendChild(battleView);
} else {
    alert(`Container element with ID=${battle} missing in the DOM`)
}
