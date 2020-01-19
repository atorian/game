import uuid from 'uuid/v4';
import { html, render } from 'lit-html';
import classnames from 'classnames';
import * as app from '../src/app';
import { BehaviorSubject, combineLatest, merge } from "rxjs";

type preset = {
    id?: string,
    name: string,
    unitId: string,
    hp: number,
    atk: number,
    def: number,
    spd: number,
    cr: number,
    cd: number,
    acc: number,
    res: number,
    runeSets: string[],
}

class Presets {
    presets: Map;

    constructor() {
        this.presets = new Map();
        this.storage = window.localStorage;
        this.isLoaded = false;
    }

    forEach(cb) {
        return this.presets.forEach(cb);
    }

    map(cb) {
        return Array.from(this.presets.values()).map(cb);
    }

    load() {
        if (!this.isLoaded) {
            let kData = this.storage.getItem('presets-ids');
            if (kData) {
                let keys = JSON.parse(kData);
                keys.forEach(k => this.presets.set(k, JSON.parse(this.storage.getItem(k))));
            }
        }
    }

    persist() {
        this.storage.setItem('presets-ids', JSON.stringify(Array.from(this.presets.keys())));
        for (const [id, preset] of this.presets.entries()) {
            this.storage.setItem(id, JSON.stringify(preset));
        }
    }

    flush() {
        let keysD = this.storage.getItem('presets-ids');
        let keys = keysD ? JSON.parse(keysD) : [];
        keys.forEach(k => this.storage.removeItem(k));
    }

    get isPopulated() {
        return this.presets.size > 0;
    }

    add(preset: preset) {
        this.presets.set(preset.id, preset);
    }

    find(id: string): preset {
        return this.presets.get(id);
    }
}

const presets = new Presets();
presets.load();

if (!presets.isPopulated) {

    const defaultPresets = [
        {
            id: uuid(),
            unitId: '12302',
            name: 'tanky tree',
            hp: 15000,
            atk: 1000,
            def: 1000,
            spd: 100,
            cr: 15,
            cd: 50,
            acc: 30,
            res: 15,
        }, {
            id: uuid(),
            unitId: '12302',
            name: 'fast tree',
            hp: 7000,
            atk: 1000,
            def: 1000,
            spd: 200,
            cr: 15,
            cd: 50,
            acc: 30,
            res: 15,
        }
    ];

    for (let p of defaultPresets) {
        presets.add(p);
    }

    presets.persist();
}

function emptyTeam(size = 3) {
    let team = new Array(size);
    team.fill(null);
    return team;
}

class PreparationVM {

    attacker = emptyTeam(3);
    defender = emptyTeam(3);
    attacker$: BehaviorSubject;
    defender$: BehaviorSubject;

    currentEditingUnit$: BehaviorSubject;
    editingUnit$: BehaviorSubject;
    editingUnit: preset;

    currentTeam$: BehaviorSubject;
    currentTeam: string;

    teams$: BehaviorSubject;

    constructor() {
        this._attacker = [
            new BehaviorSubject(null),
            new BehaviorSubject(null),
            new BehaviorSubject(null),
        ];
        this.attacker$ = combineLatest(...this._attacker);
        this.attacker$.subscribe((team) => {
            this.attacker = team;
        });

        this._defender = [
            new BehaviorSubject(null),
            new BehaviorSubject(null),
            new BehaviorSubject(null),
        ];
        this.defender$ = combineLatest(...this._defender);
        this.defender$.subscribe((team) => {
            this.defender = team;
        });

        const allSlots = [...this._attacker, ...this._defender];
        this.editingUnit$ = merge(...allSlots);
        this.editingUnit$.subscribe(p => this.editingUnit = p);

        this.currentTeam$ = new BehaviorSubject('defender');
        this.currentTeam$.subscribe(v => this.currentTeam = v);

        this.teams$ = merge(this.attacker$, this.defender$, this.currentTeam$);

        this.startBattle = this.startBattle.bind(this);
        this.removeUnit = this.removeUnit.bind(this);
    }

    get presets() {
        return presets;
    }

    get currentTeam() {
        return this.currentTeam;
    }

    get isAttackerSelected() {
        return this.currentTeam === 'attacker';
    }

    get isDefenderSelected() {
        return this.currentTeam === 'defender';
    }

    editPresetAt(team, slot: number) {
        const [slots, units] = this.getTeam(team);
        this.editUnit(slots[slot], units[slot]);
    }

    updateUnitStat(stat: string, value: number) {
        this.currentEditingUnit$.next({
            ...this.editingUnit,
            [stat]: value
        });
    }

    editUnit(unit: BehaviorSubject, stats: preset) {
        this.currentEditingUnit$ = unit;
        this.currentEditingUnit$.next(stats);
    }

    getTeam(team: string) {
        if (team === 'attacker') return [this._attacker, this.attacker];
        return [this._defender, this.defender];
    }

    addUnit(presetId: string) {
        let preset = presets.find(presetId);
        const [slots, units] = this.getTeam(this.currentTeam);
        for (const slot in units) {
            if (!units[slot]) {
                this.editUnit(slots[slot], preset);
                return;
            }
        }
        throw new Error('All of your slots are full.');
    }

    removeUnit(team, idx) {
        const [slots] = this.getTeam(team);
        slots[idx].next(null);
    }

    selectTeam(team) {
        this.currentTeam$.next(team);
    }

    startBattle() {
        app.startBattle(
            this.attacker.filter(u => u),
            this.defender.filter(u => u)
        );
    }
}

class BattlePreparation extends HTMLElement {
    constructor(vm) {
        super();
        this.attachShadow({ mode: 'open' });
        this.invalidate = this.invalidate.bind(this);
        this.onClick = this.onClick.bind(this);
        this._vm = vm;
        this._vm.teams$.subscribe(this.invalidate);
    }

    invalidate() {
        if (!this.needsRender) {
            this.needsRender = true;
            Promise.resolve().then(() => {
                this.needsRender = false;
                render(this.render(), this.shadowRoot);
            });
        }
    }

    editPreset(event, team, i) {
        event.stopPropagation();
        event.preventDefault();
        this._vm.editPresetAt(team, i);
        return false;
    }

    onClick(event) {
        let container = event.target;
        while(!container.dataset.team) {
            container = container.parentNode;
        }
        const team = container.dataset.team;
        this._vm.selectTeam(team);

        if (event.target.tagName !== 'LI') {
            const li = event.target.parentNode;
            this._vm.removeUnit(team, li.dataset.slot);
        }
    }

    render() {
        return html`
            <style>
                :host {
                    display: block;
                }
                .panel {
                    padding: 10px;
                    background-image: radial-gradient(#321B0A 60%, #241907);
                    border-radius: 10px;
                    border: 2px solid #907434;
                }
                ul {
                    display: flex;
                    justify-content: center;
                    margin: 0;
                    padding: 0;
                }
                ul li {
                    margin: 5px;
                }
                ul li p {
                    position: absolute;
                    color: #fff;
                    text-shadow: 1px 0 black;
                    top: 0;
                }
                li {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    display: block;
                    overflow: hidden;
                    border: 2px solid #907434;
                    border-radius: 10px;
                    box-shadow: 0 0 10px #321B0A;
                    background-image: url("./monster.jpg");
                    background-size: cover;
                    background-position: center;
                    background-blend-mode: overlay;
                    background-color: #321B0A;
                }
                li > x-preset {
                    display: block;
                }
                li.selected {
                
                }
                div {
                    text-align: center;
                }
                h4  {
                    margin: 0;
                    color: #fff;
                }
                .selected {
                   background-image: radial-gradient(#907434 60%, #65480A);
                   background-color: #907434; 
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
                li.selected {
                    background-image: url("https://swarfarm.com/static/herders/images/monsters/unit_icon_0010_2_1.png");
                    animation-name: blink;
                    animation-duration: 1.5s;
                    animation-iteration-count: infinite;
                }
                .monster-list {
                    justify-content: left;
                }
            </style>
            <div>
                <div class=${classnames({ panel: true, selected: this._vm.isDefenderSelected })} 
                    @click=${this.onClick} data-team="defender">
                    <h4>Defending Team</h4>
                    <ul>${this._vm.defender.map((p, i) => {
                        if (p !== null) {
                            return html`<li data-slot="${i}" 
                                    @contextmenu=${(e) => this.editPreset(e, 'defender', i)}
                                    class=${classnames({ selected: this._vm.isDefenderSelected && this._vm.currentSlot === i })} >
                                <img src="${this._vm.defender[i].img || '#'}" 
                                    title="${this._vm.defender[i].name}"
                                 />
                                <p>${this._vm.defender[i].name}</p>
                            </li>`;
                        }
                        return html`<li></li>`;
                    })}</ul>
                </div>
                <div>VS</div>
                <div class=${classnames({ panel: true, selected: this._vm.isAttackerSelected })} 
                    @click=${this.onClick} data-team="attacker">
                    <h4>Attacking Team</h4>
                    <ul>${this._vm.attacker.map((p, i) => {
                        if (p !== null) {
                            return html`<li data-slot="${i}" >
                                <img src="${this._vm.attacker[i].img || '#'}" 
                                    title="${this._vm.attacker[i].name}"
                                    @contextmenu=${(e) => this.editPreset(e, 'attacker', i)}
                                 />
                                <p>${this._vm.attacker[i].name}</p>
                            </li>`;
                        }
                        return html`<li></li>`;
                    })}</ul>
                    <button @click=${this._vm.startBattle}>Start</button>
                </div>
            </div>
        `
    }
}

customElements.define('x-battle-preparation', BattlePreparation);

class PresetEditor extends HTMLElement {

    constructor(vm) {
        super();
        this.attachShadow({ mode: 'open' });
        this.updateStat = this.updateStat.bind(this);
        this.invalidate = this.invalidate.bind(this);

        this._vm = vm;
        this._vm.editingUnit$.subscribe(this.invalidate);
    }

    render() {
        if (!this._vm.editingUnit) {
            return html`
                <style>
                :host {
                    width: inherit; 
                    height: inherit;
                    grid-template-columns: 30% auto;
                    grid-template-rows: 30% auto;
                    padding: 10px;
                    background-image: radial-gradient(#333, #222);
                    border-radius: 10px;
                    border: 2px solid #907434;
                    text-align: center;
                    color: white;
                }
                </style>
                <div>Select a monster first</div>`;
        }

        return html`
            <style>
            :host {
                width: inherit;
                height: inherit;
                display: grid;
                grid-template-columns: 30% auto;
                grid-template-rows: 30% auto;
                padding: 10px;
                background-image: radial-gradient(#321B0A 60%, #241907);
                border-radius: 10px;
                border: 2px solid #907434;
            }
            .stats {
                text-align: right;
            }
            .runesets {
                grid-row: span 2;
            }
            .runesets .options {
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                align-items:flex-start;
                align-content: flex-start;
            }
            .runesets .rune {
                display: block;
                width: 25px;
                height: 25px;
                overflow: hidden;
            }
            .runesets img {
                max-width: 100%;
                max-height: 100%;
            }
            .runesets .equipped {
                
            }
            h2 {
                color: #fff;
            }
            </style>
            <img src="https://swarfarm.com/static/herders/images/monsters/unit_icon_0010_2_1.png"
                .title=${this._vm.editingUnit.title} alt="unit icon">
            <input id="name" type="text" name="name" 
                    @change=${this.updateStat} 
                    .value="${this._vm.editingUnit.name}">
            <div class="runesets">
                <div class="equipped"></div>
                <div class="options" style="display: none">
                    <div class="rune" data-size="4">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/1/11/Violent_Rune_Icon.png" 
                            alt="violent rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/7/7a/Will_Rune_Icon.png" 
                            alt="will rune">
                    </div>
                    <div class="rune" data-size="4">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/f/f4/Fatal_Rune_Icon.png" 
                            alt="fatal rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/8/86/Blade_Rune_Icon.png" 
                            alt="blade rune">
                    </div>
                    <div class="rune" data-size="4">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/2/22/Swift_Rune_Icon.png" 
                            alt="swift rune">
                    </div>
                    <div class="rune" data-size="4">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/8/8a/Vampire_Rune_Icon.png" 
                            alt="Vampire rune">
                    </div>
                    <div class="rune" data-size="4">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/4/40/Despair_Rune_Icon.png" 
                            alt="Despair rune">
                    </div>
                    <div class="rune" data-size="4">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/6/63/Rage_Rune_Icon.png" 
                            alt="Rage rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/7/76/Shield_Rune_Icon.png" 
                            alt="Shield rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/b/be/Fight_Rune_Icon.png" 
                            alt="Fight rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/7/76/Focus_Rune_Icon.png" 
                            alt="focus rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/5/54/Guard_Rune_Icon.png" 
                            alt="guard rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/f/f0/Endure_Rune_Icon.png" 
                            alt="Endure rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/1/1f/Revenge_Rune_Icon.png" 
                            alt="Revenge rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/c/c5/Nemesis_Rune_Icon.png" 
                            alt="Nemesis rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/7/76/Destroy_Rune_Icon.png" 
                            alt="Destroy rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/9/92/Determination_Rune_Icon.png" 
                            alt="Determination rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/0/07/Enhance_Rune_Icon.png" 
                            alt="Enhance rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/9/96/Accuracy_Rune_Icon.png" 
                            alt="Accuracy rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/7/70/Tolerance_Rune_Icon.png" 
                            alt="Tolerance rune">
                    </div>
                    <div class="rune" data-size="2">
                        <img src="https://vignette.wikia.nocookie.net/summoners-war-sky-arena/images/a/a0/Energy_Rune_Icon.png" 
                            alt="energy rune">
                    </div>
                </div>
            </div>
            <div class="stats">
                <div>
                    <label for="hp">HP</label>
                    <input id="hp" type="number" name="hp" .value="${this._vm.editingUnit.hp}" @change=${this.updateStat}>
                </div>
                <div>
                    <label for="atk">ATK</label>
                    <input id="atk" type="number" name="atk" .value="${this._vm.editingUnit.atk}" @change=${this.updateStat}>
                </div>
                <div>
                    <label for="def">DEF</label>
                    <input id="def" type="number" name="def" .value="${this._vm.editingUnit.def}" @change=${this.updateStat}>
                </div>
                <div>
                    <label for="spd">SPD</label>
                    <input id="spd" type="number" name="spd" .value="${this._vm.editingUnit.spd}" @change=${this.updateStat}>
                </div>
                <div>
                    <label for="cr">CR</label>
                    <input id="cr" type="number" name="cr" .value="${this._vm.editingUnit.cr}" @change=${this.updateStat}>
                </div>
                <div>
                    <label for="cd">CD</label>
                    <input id="cd" type="number" name="cd" .value="${this._vm.editingUnit.cd}" @change=${this.updateStat}>
                </div>
                <div>
                    <label for="res">RES</label>
                    <input id="res" type="number" name="res" .value="${this._vm.editingUnit.res}" @change=${this.updateStat}>
                </div>
                <div>
                    <label for="acc">ACC</label>
                    <input id="acc" type="number" name="acc" .value="${this._vm.editingUnit.acc}" @change=${this.updateStat}>
                </div>
            </div>
        `;
    }

    updateStat(event) {
        this._vm.updateUnitStat(event.target.name, event.target.value);
        event.preventDefault();
        return false;
    }

    invalidate() {
        if (!this.needsRender) {
            this.needsRender = true;
            Promise.resolve().then(() => {
                this.needsRender = false;
                render(this.render(), this.shadowRoot);
            });
        }
    }

    connectedCallback() {
        this.invalidate();
    }
}

customElements.define('x-preset-editor', PresetEditor);

class Preset extends HTMLElement {
    _preset;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.addEventListener('contextmenu', (evt) => {
            if (this.withStats) {
                this.toggleStats();
                evt.preventDefault();
                return false;
            }
        });
    }

    static get observedAttributes() {
        return ['preset-id'];
    }

    connectedCallback() {
        this.withStats = this.hasAttribute('with-stats');
        this.preset = presets.find(this.getAttribute('preset-id'));
    }

    set preset(data: preset) {
        this._preset = data;
        this._preset.img = 'https://swarfarm.com/static/herders/images/monsters/unit_icon_0010_2_1.png';
        this.invalidate();
    }

    render() {
        return html`
            <style>
            :host {
                background: white;
                display: block;
                overflow: hidden;
                width: inherit;
                height: inherit;
                position:relative;
            }
            :host {
                background: white;
                display: block;
                overflow: hidden;
                width: inherit;
                height: inherit;
            }
            img {
                width: 100%;
                height: 100%;
            }
            dl, dd, dt {
                margin: 0;
            }
            .stats {
                display: flex;
                font-size: 10px;
                flex-wrap: wrap;
                margin: 0;
                padding: 5px;
            }
            .stats dt, .stats dd {
                width: 25%;
            }
            p {
                position: absolute;
                top: 0;
                color: white;
                text-shadow: 1px 0 #fff;
            }
            </style>
            <img src="${this._preset.img || '#'}" alt="monster name" title="${this._preset.name}" />
            <p>${this._preset.name}</p>
            <dl class="stats" hidden>
                <dt>HP</dt><dd>${this._preset.hp}</dd>
                <dt>CR</dt><dd>${this._preset.cr}</dd>
                <dt>ATK</dt><dd>${this._preset.atk}</dd>
                <dt>CD</dt><dd>${this._preset.cd}</dd>
                <dt>DEF</dt><dd>${this._preset.def}</dd>
                <dt>RES</dt><dd>${this._preset.res}</dd>
                <dt>SPD</dt><dd>${this._preset.spd}</dd>
                <dt>ACC</dt><dd>${this._preset.acc}</dd>
            </dl>
            <ul class="runsets" hidden>
                <li>vio</li>
                <li>will</li>
            </ul>
        `;
    }

    invalidate() {
        if (!this.needsRender) {
            this.needsRender = true;
            Promise.resolve().then(() => {
                this.needsRender = false;
                render(this.render(), this.shadowRoot);
                this.stats = this.shadowRoot.querySelector('.stats');
                this.img = this.shadowRoot.querySelector('img');
                this.runsets = this.shadowRoot.querySelector('.runsets');
            });
        }
    }

    toggleStats() {
        this.stats.toggleAttribute('hidden');
        this.img.toggleAttribute('hidden');
        this.runsets.toggleAttribute('hidden');
    }
}

customElements.define('x-preset', Preset);

class PresetsList extends HTMLElement {

    constructor(vm) {
        super();
        this.attachShadow({ mode: 'open' });
        this._vm = vm;
    }

    connectedCallback() {
        this.invalidate();
    }

    invalidate() {
        if (!this.needsRender) {
            this.needsRender = true;
            Promise.resolve().then(() => {
                this.needsRender = false;
                render(this.render(), this.shadowRoot);
            });
        }
    }

    render() {
        return html`
            <style>
                :host {
                    padding: 10px;
                    background-image: radial-gradient(#321B0A 60%, #241907);
                    border-radius: 10px;
                    border: 2px solid #907434;
                }
                ul {
                    display: flex;
                    justify-content: left;
                    margin: 0;
                    padding: 0;
                }
                ul li {
                    margin: 5px;
                }
                li {
                    width: 100px;
                    height: 100px;
                    display: block;
                    overflow: hidden;
                    border: 2px solid #907434;
                    border-radius: 10px;
                    box-shadow: 0 0 10px #321B0A;
                    background-image: url("./monster.jpg");
                    background-size: cover;
                    background-position: center;
                    background-blend-mode: overlay;
                    background-color: #321B0A;
                }
                li > x-preset {
                    display: block;
                }
                h4  {
                    color: white;
                }
            </style>
            <div class="options panel">
                <h4>Presets</h4>
                <ul class="monster-list">${this._vm.presets.map((p) => html`<li @click=${() => {
            this._vm.addUnit(p.id);
        }}>
                    <x-preset preset-id="${p.id}" with-stats></x-preset>
                </li>`)}</ul>
            </div>
        `
    }
}

customElements.define('x-preset-list', PresetsList);

// this is ViewEngine logic and should be treated as such. Not a generic init code.
const container = document.getElementById("app");
if (container) {

    let vm = new PreparationVM(); // if it's SPA - must be created by presenter
    let teams = new BattlePreparation(vm);
    let editor = new PresetEditor(vm);
    let presets = new PresetsList(vm);

    container.appendChild(teams);
    container.appendChild(editor);
    container.appendChild(presets);

} else {
    alert(`Container element with ID="app" missing in the DOM`)
}


/**

 when url opened:
 App is initiated
 View is created (view is known)
 ViewModel is created
 ViewModel calls app for data

 V --> VM -> App(Controller) -> UC <-> Domain
 UC -> Presenter -> VM <-- View


 when url (/prepare) is opened <- it's a router. part of the app?
 init app with web config
 - use web presenter to create web VMs
 call app.run()
 app takes web router
 figures out by the route which UC to call
 calls the UC
 UC calls the presenter with the ResponseDate
 Presenter forms a ViewModel and calls View.render(ViewModel)
 ViewModel contains all possible visually significant properties for the view





 App:
 Is a Facade for Model and it's interactions.
 Uses UseCases to perform commands.

 new ViewModel(App, Router);
 Loads Model Data from App.
 Exposes properties for the view. Already calculated.
 Dispatches PropChanged events
 Applies changes on Model by calling app.UseCases
 Uses Router to navigate between screens.

 new View(ViewModel);
 binds VM properties to template,
 subscribes to events, delegates commands to VM

 new Router();
 Is a part of ViewModel. As it might differ for devices

 new UseCase();
 Performs different actions on Model, Validates commands and calls presenter back to display new data.


 */


// stenciljs
