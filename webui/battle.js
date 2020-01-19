// @flow
import type { Unit } from "../src";
import { FIRE } from "../src";
// import swunits from '../src/sw-units';
import HpBar from './hp-bar';
import AtkBar from './atk-bar';
import * as app from '../src/app';

customElements.define('x-hp-bar', HpBar);
customElements.define('x-atb', AtkBar);

require('../src/sw-skills');

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

function displayTeam(units: Unit[]) {
    let res = {};
    for (let unit of units) {
        res[unit.id] = {
            id: unit.unitId * 1,
            skills: unit.skills,
            ...Units.get(unit.unitId * 1),
        };
    }
    return res;
}

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
    destroyedHP: number = 0;

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

    onTargeted: (id: string) => void;
    _events: Object[];

    constructor(battleData, displayData, isCurrent, isTarget, onTargeted, events) {
        // todo: refactor this
        Object.assign(this, displayData, battleData, {
            isCurrent,
            isTarget,
            effects: battleData.effects.elements.filter(e => e.duration),
            skills: battleData.skills.map(s => ({
                id: s.id,
                cooldown: s.cooldown,
                ...Skills.get(s.id),
            })),
            onTargeted,
        });

        this._events = events;
    }

    castSkill() {
        if (this.isTarget) {
            this.onTargeted(this.id);
        }
    }

    get events() {
        let events = [];
        // removed effects do not appier to indicate themselfs in the text messages
        for (let e of this._events) {
            if (e.dmg) {
                events.push({ text: e.dmg, type: 'harmful' });
                if (e.kind !== 'normal') {
                    events.push({ text: e.kind });
                }
            }
            if (e.effect) {
                events.push({ text: e.effect.name, type: 'harmful' });
            }
            if (e.resisted) {
                events.push({ text: 'resisted', type: 'beneficial' });
            }
        }

        return events;
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

class BattleVM {
    battle;
    battleView;
    _selectedSkill;
    winnerText: string;
    _events: Object[];

    constructor(battleId: string) {
        this.battle = app.getBattle(battleId);
        if (!this.battle.current) {
            setTimeout(() => {
                this.battle.next();
                this.changed();
            }, 500);
        }

        const units = Object.values(this.battle.units);

        this.battleView = {
            attacker: displayTeam(units.filter(u => u.player === 'attacker')),
            defender: displayTeam(units.filter(u => u.player === 'defender')),
        };

        this.castSkillOn = this.castSkillOn.bind(this);
        this.interpretEvent = this.interpretEvent.bind(this);
    }

    _subscribers = [];

    changed() {
        this._events = this.battle.events;
        this.battle.events = [];

        this._subscribers.forEach(l => l());

        if (!this.battle.current && !this.winnerText) {
            setTimeout(() => {
                if (this.battle.ended) {
                    this.winnerText = this.battle.winner === 'attacker' ? 'VICTORY' : 'LOOSE';
                } else {
                    this.battle.next();
                }
                this.changed();
            }, 500);
        }
    };


    onChange(callback) {
        this._subscribers.push(callback);
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
        for (let k in this.battleView[player]) {
            res.push(
                new ContestantVM(
                    this.battle.units[k],
                    this.battleView[player][k],
                    this.battle.current && this.battle.current.id === k,
                    isTarget(this.selectedSkill, this.battle.current, this.battle.units[k]),
                    this.castSkillOn
                )
            );
        }
        return res;
    }

    contestant(unitId): ContestantVM {
        let u = this.battle.units[unitId];
        return new ContestantVM(
            u,
            this.battleView[u.player][unitId],
            this.battle.current && this.battle.current.id === unitId,
            isTarget(this.selectedSkill, this.battle.current, this.battle.units[unitId]),
            this.castSkillOn,
            this._events.filter(e => e.id === u.id),
        );
    }

    interpretEvent(e) {
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
                const player = this.battle.units[e.id].player;
                const unit = this.battleView[player][e.id];
                return `${unit.name} of ${player} starts turn`;
            default:
                return `${e.constructor.name}: ${JSON.stringify(e, null, 2)}`;
        }
    }

    get teamA() {
        return this.getTeam('attacker');
    }

    get teamB() {
        return this.getTeam('defender');
    }

    get log(): string[] {
        return this._events.map(this.interpretEvent).filter(e => e);
    }
}

class SkillView extends HTMLElement {
    root: ShadowRoot;
    img: HTMLImageElement;
    text: HTMLSpanElement;
    _icon: string;
    _cooldown: number;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `
            <style>
                :host {
                    position: relative;
                    z-index: 2;
                    display: inline-block;
                    line-height: 40px;
                    vertical-align: middle;
                    text-align: center;
                    width: 40px;
                    height: 40px;
                    overflow: hidden;
                    border-radius: 5px;
                    border: 2px solid ghostwhite;
                    box-shadow: 0 0 5px 1px rgba(0,0,0,0.75),
                                inset 0 0 3px 1px rgba(255,255,255,0.75);
                    font-size: 30px;
                    color: white;
                }
                :host img {
                    position: absolute;
                    height: 100%;
                    z-index: -1;
                    width: 100%;
                    left: 0;
                    top: 0;
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
                :host([selected]) {
                    animation-name: blink;
                    animation-duration: 1.5s;
                    animation-iteration-count: infinite;
                }
            </style>
            <img src="${ASSETS_URL}/not_found.png"/>
            <span></span>
        `;
        this.img = ((this.root.querySelector('img'): any): HTMLImageElement);
        this.text = ((this.root.querySelector('span'): any): HTMLSpanElement);
    }

    static get observedAttributes() {
        return ['icon', 'cooldown'];
    }

    set selected(value) {
        if (value) {
            this.setAttribute('selected', '');
        } else {
            this.removeAttribute('selected');
        }
    }

    get selected() {
        return this.hasAttribute('selected');
    }

    set icon(value) {
        this._icon = value;
        this.img.src = `${ASSETS_URL}/${value}`;
    }

    get icon() {
        return this._icon;
    }

    set cooldown(value) {
        this._cooldown = value;
        if (this._cooldown > 0) {
            this.setAttribute('disabled', '');
            this.text.innerText = this._cooldown;
        } else {
            this.removeAttribute('disabled');
            this.text.innerText = '';
        }
    }

    get cooldown() {
        return this._cooldown;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'icon') {
            this.icon = newValue;
        }
        if (name === 'cooldown') {
            this.cooldown = newValue;
        }
    }
}

customElements.define('sw-skill', SkillView);

class ContestantView extends HTMLElement {
    unit: ContestantVM;
    hpBar: HPBar;
    atkBar: AttackBar;
    root: ShadowRoot;

    constructor(unit: ContestantVM) {
        super();
        this.unit = unit;
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `
            <style>
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
                
                :host {
                    display: inline-block;
                    position:relative;
                    z-index: 1;
                    width: 120px;
                    padding: 3px;
                }
                .targetable img {
                    width: 100%;
                }
                .targetable {
                    position:relative;
                    background: white;
                    cursor: pointer;
                    animation-name: blink;
                    animation-duration: 1.5s;
                    animation-iteration-count: infinite;
                    box-shadow: 0 0 10px 0 red;
                }
                :host([disabled]) .targetable {
                    cursor: default;
                    animation-name: none;
                    box-shadow: none;
                }
                :host([current]) {
                    
                }
                @keyframes spin { 
                    from { 
                        transform: rotate(0deg); 
                    } to { 
                        transform: rotate(360deg); 
                    }
                }
                .circle {
                    display: none;
                }
                :host([current]) .circle {
                    color: transparent;
                    filter: invert(1); 
                    display: block;
                    background-image: url("./magic-circle.png");
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: cover;
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    left: 50%;
                    top: -10px;
                    margin-left: -100px;
                    z-index: -1;
                    animation-name: spin;
                    animation-duration: 60s;
                    animation-iteration-count: infinite;
                    animation-timing-function: linear;
                }
                .info {
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
                    z-index: 1;
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
                .skills {
                    margin-top: 5px;
                }
                x-atb {
                    z-index:5;
                }
                @keyframes fadeout {
                    from { 
                        opacity: 1;
                        transform: scale(1);      
                    }
                    to   { 
                        opacity: 0.5;
                        transform: scale(0.5); 
                    }
                }
                @keyframes fly-out {
                    0% {
                        font-size: 16px;
                        top: 0%;
                        opacity: 0;
                    }
                    10% {
                        top: 20%;
                        opacity: 1;
                    }
                    80% {
                        top: 40%;
                        opacity: 1;
                    } 
                    100% {
                        opacity: 0;
                        top: 100%;
                    }
                }
                .delta {
                    font-weight: bold;
                    position: absolute;
                    overflow: hidden;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }
                .delta div {
                    font-family: Helvetica, Arial;
                    animation: fly-out;
                    animation-duration: 500ms;
                    animation-iteration-count: 1;
                    animation-timing-function: linear;
                    top: 100%;
                    opacity: 0;
                    position: absolute;
                    color: yellow;
                    font-size: 40px;
                    width: 100%;
                    text-align: center;
                    text-shadow: 0 0 5px black;
                }
                .delta .beneficial {
                    color: limegreen;
                }
                .delta .harmful {
                    color: red;
                }
            </style>
            <div class="circle"></div>
            <x-hp-bar max="${this.unit.hp}" current="${this.unit.currentHP}" destroyed="0" ></x-hp-bar>
            <x-atb value="${this.unit.atb}"></x-atb>
            <div class="targetable">
                <div class="icon">
                    <ul class="effects">
                        ${this.unit.effects.map(effect => `<li class="effect effect-${effect.name}">${effect.duration}</li>`)}
                    </ul>
                    <img src="${ASSETS_URL}${this.unit.icon}" alt="${this.unit.name}" class="unit-icon"/>
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
                <div class="delta">
                </div>
            </div>
            <div class="skills">
                ${this.unit.skills.map(s => `<sw-skill icon="${s.icon}" cooldown="${s.cooldown}" description="${s.description}"/>`)}
            </div>
        `;

        this.hpBar = this.root.querySelector('x-hp-bar');
        this.atkBar = this.root.querySelector('x-atb');

        this.root.querySelector('.targetable').addEventListener('click', () => this.unit.castSkill());

        this.delta = this.root.querySelector('.delta');
        const infoIcon = this.root.querySelector('.info');
        infoIcon.onmouseover = () => this.showStats();
        infoIcon.onmouseout = () => this.hideStats();
    }

    update(unit: ContestantVM) {
        this.unit = unit;
        let pendingEvents = this.unit.events;

        this.delta.innerHTML = '';
        pendingEvents.forEach((event, i) => {
            if (event.text) {
                let d = document.createElement('div');
                d.className = event.type;
                d.innerText = event.text;
                d.style.cssText = `animation-delay: ${500 / pendingEvents.length * i}ms`;
                this.delta.appendChild(d);
            }
        });

        // debugger;
        if (this.unit.isCurrent) {
            this.setAttribute('current', '');
        } else {
            this.removeAttribute('current');
        }

        if (this.unit.isTarget) {
            this.removeAttribute('disabled');
        } else {
            this.setAttribute('disabled', '');
        }

        this.atkBar.value = this.unit.atb;

        this.hpBar.value = this.unit.currentHP;
        this.hpBar.destroyed = this.unit.destroyedHP;
        this.hpBar.max = this.unit.hp;

        ['hp', 'atk', 'def', 'spd', 'cr', 'cd', 'acc', 'res'].forEach(stat => {
            this.root.querySelector(`[data-stat="${stat}"]`).innerText = this.unit[stat];
        });

        // todo: update skill cooldowns
        this.root.querySelector('.effects').innerHTML = this.unit.effects.map(
            effect => `<li class="effect effect-${effect.name}">${effect.duration}</li>`
        ).join('')
    }

    showStats() {
        this.root.querySelector('.stats').removeAttribute('hidden');
        this.root.querySelector('.icon').setAttribute('hidden', '');
    }

    hideStats() {
        this.root.querySelector('.stats').setAttribute('hidden', '');
        this.root.querySelector('.icon').removeAttribute('hidden');
    }
}

customElements.define('x-contestant', ContestantView);

class GuildBattleView extends HTMLElement {
    _battle: BattleVM;
    info: HTMLParagraphElement;
    root: ShadowRoot;  // sub view
    skills: HTMLUListElement;
    units: { string: ContestantView } = {};

    constructor(battleVM) {
        super();
        this._battle = battleVM;

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `
            <style>
            p {
                position: absolute;
                width: 200px;
                margin: 10px auto;
                text-align: left;
                overflow-y: scroll;
                font-family: Helvetica, Arial;
                color: white;
                left: 50%;
                margin-left: -100px;
                top: 45%;
            }
            textarea {
                height: 200px;
                width: 100%;
                border: none;
                padding: 0;
            }
            nav {
                position: relative;
                height: 44px;
                z-index: 1;
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
            nav :active {
                 animation-name: scale;
                 animation-duration: 0.3s;
                 animation-iteration-count: 1;
            }
            nav {
                margin: 30px 0;
                text-align: center;
            }

            div {
                text-align: center;
                padding-top: 40px;
            }
            </style>
            <div data-team="player-2"></div>
            <nav></nav>
            <div data-team="player-1"></div>
            <p></p>
            <div id="result-screen"></div>
        `;
        this.info = this.root.querySelector('p');
        let node = this.root.querySelector('[data-team="player-2"]');
        for (const u of this._battle.teamB) {
            this.units[u.id] = new ContestantView(u);
            node.appendChild(this.units[u.id]);
        }
        node = this.root.querySelector('[data-team="player-1"]');
        for (const u of this._battle.teamA) {
            this.units[u.id] = new ContestantView(u);
            node.appendChild(this.units[u.id]);
        }

        this.skills = this.root.querySelector('nav');

        this._battle.onChange(() => this.update());
    }

    _showSkillInfo(description: string) {
        this.info.textContent = description;
    }

    _hideSkillInfo() {
        this.info.textContent = '';
    }

    update() {
        for (const id in this.units) {
            this.units[id].update(
                this._battle.contestant(id)
            );
        }
        this.skills.innerHTML = '';
        for (const skill of this._battle.availableSkills) {
            let skillView = new SkillView();
            skillView.icon = skill.icon;
            skillView.cooldown = skill.cooldown;
            skillView.selected = skill.id === this._battle.selectedSkill.id;
            skillView.onclick = () => this._battle.selectSkill(skill.id);
            skillView.onmouseover = () => this._showSkillInfo(skill.description);
            skillView.onmouseout = () => this._hideSkillInfo();
            this.skills.appendChild(skillView);
        }
    }
}

customElements.define('x-battle', GuildBattleView);

const container = document.getElementById("battle");
if (container) {
    const urlParams = new URLSearchParams(window.location.search);
    const battleId = urlParams.get('id');
    let battleVM = new BattleVM(battleId);
    let battleView = new GuildBattleView(battleVM);
    container.appendChild(battleView);
    const log = document.getElementById('battle-log');
    battleVM.onChange(() => {
        log.value = [log.value, ...battleVM.log].join('\n');
        log.scrollTop = log.scrollHeight;
    });

    const victoryPopup = document.getElementById('victory');
    battleVM.onChange(() => {
        if (battleVM.winnerText) {
            victoryPopup.innerText = battleVM.winnerText;
            victoryPopup.removeAttribute('hidden');
        }
    });
} else {
    alert(`Container element with ID="battle" missing in the DOM`)
}
