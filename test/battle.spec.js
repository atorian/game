const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const { assert } = chai;

import { DARK, FIRE, LIGHT, WATER, WIND } from "./elements";
// import { ELEMENT_RELATIONS } from "../src/domain/skill-mechanics";
// import {fight, Contestant, Theomars, MegaSmash} from '../src/index2';
// import type {TargetSkill} from '../src/index2';
// import {player, ai} from '../src/index';
// import TeamBuilder, {prepareForBattle} from '../src/domain/battle_preparation';
// import {slime, bernard} from '../src/units';

type Stats = {
    hp: number;
    atk: number;
    def: number;
    spd: number;
    cr: number;
    cd: number;
    res: number;
    acc: number;
}


type Unit = {
    id: string;
    player: string;
    element: string;
    skills: number[];
} & Stats

type Player = {
    id: string
}

type Towers = {
    atk: number,
    def: number,
    wind_atk: number,
    fire_atk: number,
    water_atk: number,
    light_atk: number,
    dark_atk: number,
    cd: number,
    hp: number,
    spd: number,
};

const DEFAULT_TOWER_MULTIPLIERS = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const TowerMultipliers = {
    def: DEFAULT_TOWER_MULTIPLIERS,
    atk: DEFAULT_TOWER_MULTIPLIERS,
    wind_atk: DEFAULT_TOWER_MULTIPLIERS,
    fire_atk: DEFAULT_TOWER_MULTIPLIERS,
    water_atk: DEFAULT_TOWER_MULTIPLIERS,
    light_atk: DEFAULT_TOWER_MULTIPLIERS,
    dark_atk: DEFAULT_TOWER_MULTIPLIERS,
    hp: DEFAULT_TOWER_MULTIPLIERS,
    cd: [2, 5, 7, 10, 12, 15, 17, 20, 22, 25],
    spd: [2, 3, 5, 6, 8, 9, 11, 12, 14, 15],
};

const MAX_TOWER_LVL = 10;

const GloryTowers = {

    towers: {
        "player-id": { // Towers
            def: MAX_TOWER_LVL,
            atk: MAX_TOWER_LVL,
            wind_atk: MAX_TOWER_LVL,
            fire_atk: MAX_TOWER_LVL,
            water_atk: MAX_TOWER_LVL,
            light_atk: MAX_TOWER_LVL,
            dark_atk: MAX_TOWER_LVL,
            hp: MAX_TOWER_LVL,
            cd: MAX_TOWER_LVL,
            spd: MAX_TOWER_LVL,
        }
    },

    apply(unit: Unit) {
        const towers = this.towers[unit.player];

        let res = {
            atk: TowerMultipliers.atk[towers.atk - 1] * unit.atk / 100,
            def: TowerMultipliers.def[towers.def - 1] * unit.def / 100,
            hp: TowerMultipliers.hp[towers.hp - 1] * unit.hp / 100,
            spd: TowerMultipliers.spd[towers.spd - 1] * unit.spd / 100,
            cd: TowerMultipliers.cd[towers.cd - 1],
        };

        res.currentHP = res.hp;

        switch (unit.element) {
            case WIND:
                res.atk = res.atk + TowerMultipliers.wind_atk[towers.wind_atk - 1] * unit.atk / 100;
                break;
            case FIRE:
                res.atk = res.atk + TowerMultipliers.fire_atk[towers.fire_atk - 1] * unit.atk / 100;
                break;
            case WATER:
                res.atk = res.atk + TowerMultipliers.water_atk[towers.water_atk - 1] * unit.atk / 100;
                break;
            case LIGHT:
                res.atk = res.atk + TowerMultipliers.light_atk[towers.light_atk - 1] * unit.atk / 100;
                break;
            case DARK:
                res.atk = res.atk + TowerMultipliers.dark_atk[towers.dark_atk - 1] * unit.atk / 100;
                break;
        }

        return res;
    }
};

const GuildFlags = {

    towers: {
        "player-id": {
            def: MAX_TOWER_LVL,
            atk: MAX_TOWER_LVL,
            hp: MAX_TOWER_LVL,
            cd: MAX_TOWER_LVL,
        }
    },

    apply(unit: Unit) {
        const towers = this.towers[unit.player];

        return {
            cd: TowerMultipliers.cd[towers.cd - 1],
            atk: TowerMultipliers.atk[towers.atk - 1] * unit.atk / 100,
            def: TowerMultipliers.def[towers.def - 1] * unit.def / 100,
            hp: TowerMultipliers.hp[towers.hp - 1] * unit.hp / 100,
            currentHP: TowerMultipliers.hp[towers.hp - 1] * unit.hp / 100,
        };
    }
};

function targetEnemy(targetId, units) {
    return [units[targetId]];
}

type SkillMeta = {
    cooldown: number,
    dmgMultiplier: number,
    effectMultiplier: number,
}

function defaultRng(): number {
    return _.random(1, 100);
}

type rng = () => number;

function hit(roll: rng = defaultRng) {
    let chance = roll();
    // todo: add elemental king effect = always advantage
    // const glancing_chance = ELEMENT_RELATIONS[context.caster.element].weak === context.target.element ? 15 : 0;
    // const crit_mod = hasAdvantage(context.caster, context.target) ? 15 : 0;
    //
    // if (n <= (glancing_chance + context.caster.glancing_mod)) {
    //     return new GlancingDamageStrategy(context);
    // } else if (this.roll() <= context.caster.cr + crit_mod) {
    //     return new CritDamageStrategy(context);
    // } else if (hasAdvantage(context.caster, context.target) && this.roll() <= 15) {
    //     return new CrushingDamageStrategy(context);
    // }
    //
    // return new NormalDamageStrategy(context);
}


const GenericSkills: Map<number, SkillSpec> = {
    1: {
        target: targetEnemy,
        action: [
            function (caster: Contestant, target: Contestant, params: SkillMeta) {
                const rawDmg = caster.atk * 3.3 + 35;
                target.dmg(rawDmg * (100 + params.dmgMultiplier) / 100);
            }
        ],
        meta: {
            dmgMultiplier: 0.3,
            effectMultiplier: 0.35,
            cooldown: 0,
        }
    }
};

type SkillSpec = {
    target: Targeter,
    action: BattleMechanic[],
    meta: SkillMeta,
}

function compose(mechanics: BattleMechanic[]): BattleMechanic {
    return (caster: Contestant, target: Contestant, meta: SkillMeta) => {
        mechanics.forEach((m) => m(caster, target, meta));
    }
}

function GetSkill(id) {
    let spec: SkillSpec = GenericSkills[id];

    if (spec) {
        return new GenericSkill(
            spec.meta,
            spec.target,
            compose(spec.action),
        );
    }

    throw new Error('Unknown Skill');
}

interface Ability {
    cast(caster: Contestant, target: number, units: Contestant[]): void;
}

interface RefreshableAbility {
    refresh(): void;
}

type Targeter = (string, Map<string, Unit>) => Unit[];
type BattleMechanic = (Contestant, Contestant, SkillMeta) => void;

class GenericSkill implements Ability, RefreshableAbility {
    meta: SkillMeta;
    target: Targeter;
    apply: BattleMechanic;
    cooldown: number = 0;

    constructor(meta: SkillMeta, target: Targeter, apply: BattleMechanic) {
        this.meta = meta;
        this.target = target;
        this.apply = apply;
    }

    cast(caster, target, units) {
        this.target(target, units).forEach(t => this.apply(caster, t, this.meta));
        this.cooldown = this.meta.cooldown;
    }

    refresh(turns: number) {
        if (turns > 0) {
            this.cooldown = Math.max(0, this.cooldown - turns);
        } else {
            this.cooldown = 0;
        }
    }
}

interface Observer {
    subscribe(battle: Battle): void;
}

class BattleStarted {
    constructor(battleId, type, teamA, teamB) {
        this.id = battleId;
        this.type = type;
        this.teamA = teamA;
        this.teamB = teamB;
    }
}

class TurnStarted {
    constructor(unit: Contestant) {
        this.id = unit.id;
        this.atb = 0;
        this.cooldowns = unit.skills.map(s => {
            s.refresh(1);
            return s.cooldown;
        });
    }
}

class Tick {
    constructor(unit: Contestant) {
        this.id = unit.id;
        this.atb = unit.atb + Math.round(unit.spd * 0.07);
    }
}

class GloryTowersApplied {
    constructor(unit: Contestant) {
        this.id = unit.id;
        Object.assign(this, GloryTowers.apply(unit));
    }
}

class GuildFlagsApplied {
    constructor(unit: Contestant) {
        this.id = unit.id;
        Object.assign(this, GuildFlags.apply(unit));
    }
}

class DmgReceived {
    constructor(unit: Contestant, dmg) {
        this.id = unit.id;
        this.currentHP = Math.max(0, Math.round(unit.currentHP - dmg));
    }
}

class SkillCasted {
    constructor(unit: Contestant, skillId) {
        this.id = unit.id;
        this.cooldowns = {
            [skillId]: unit.skills[skillId].cooldown
        };
    }
}

const BTL = Symbol('battle');

class Contestant {

    id: string;
    element: WIND | FIRE | WATER | LIGHT | DARK;
    player: string;

    currentHP: number;
    atb: number;

    hp: number;
    atk: number;
    def: number;
    spd: number;
    cr: number;
    cd: number;
    res: number;
    acc: number;

    constructor(battle, unit: Unit) {
        this[BTL] = battle;
        const { id, element, player, skills, ...stats } = unit;

        this.id = id;
        this.element = element;
        this.player = player;
        //
        Object.assign(this, stats);
        this.currentHP = this.hp;
        //
        this.atb = 0;
        this.skills = skills.map(GetSkill);

        // this.subscribePassives(battle);
    }

    useSkill(skillId, targetId, units) {
        const skill = this.skills[skillId];
        skill.cast(this, targetId, units);
        this[BTL].causes(new SkillCasted(this, skillId));
    }

    tick() {
        this[BTL].causes(
            new Tick(this)
        );
    }

    startTurn() {
        this[BTL].causes(
            new TurnStarted(this)
        );
    }

    dmg(amount) {
        this[BTL].causes(
            new DmgReceived(this, amount)
        );
    }

    applyPermanentStats(extraStats: Unit) {
        const {id, ...stats} = extraStats;
        for (const i in stats) {
            this[i] += stats[i];
        }
    }

    apply(event: Object) {
        const { id, cooldowns, ...stats } = event;

        if (cooldowns) {
            for (const i in cooldowns) {
                this.skills[i].cooldown = cooldowns[i];
            }
        }

        Object.assign(this, stats);
    }
}

class SkillUsed {
    constructor(skillId, targetId) {
        this.skillId = skillId;
        this.targetId = targetId;
    }
}

class CurrentActiveUnit {
    constructor(unit: Contestant) {
        this.id = unit.id;
        this.skills = Object.keys(unit.skills).reduce((skills, skillId) => {
            skills[skillId] = unit.skills[skillId].cooldown;
            return skills;
        }, {});
    }
}

class Battle {

    static SCENARIO: string = 'scenario';
    static ARENA: string = 'arena';
    static GUILD_BATTLE: string = 'guild_battle';
    static DUNGEON: string = 'dungeon';
    static RIFT: string = 'rift';
    static TOA: string = 'toa';
    //
    static ATB_SIZE = 100;
    //
    id: string;
    version: number = 0;
    events: [];
    //
    type: string;
    started: boolean = false;
    units: { [string]: Contestant } = {};
    current: Contestant;

    constructor(id: string) {
        this.id = id;
        this.events = [];

        this.applyTowers = this.applyTowers.bind(this);
    }

    applyTowers(unit: Unit) {
        this.causes(new GloryTowersApplied(unit));
        if (this.type === Battle.GUILD_BATTLE) {
            this.causes(new GuildFlagsApplied(unit));
        }
    }

    start(teamA: Unit[], teamB: Unit[], type) {
        this.causes(new BattleStarted(this.id, type, teamA, teamB));
    }

    next() {
        const units = Object.values(this.units);
        units.forEach(unit => unit.tick());

        const next = units
            .filter(u => u.atb >= Battle.ATB_SIZE)
            .sort((a, b) => a.atb - b.atb)
            .pop();

        if (!next) {
            return this.next();
        }

        next.startTurn();

        return new CurrentActiveUnit(next);
    }

    cast(skillIdx, targetId) {
        if (this.current.skills[skillIdx].cooldown === 0) {
            this.causes(new SkillUsed(skillIdx, targetId));
            return;
        }
        throw new Error("Skill is on CD");
    }

    when(event: Object) {
        switch (event.constructor) {
            case BattleStarted:
                this.started = true;
                this.type = event.type;
                [...event.teamA, ...event.teamB].forEach((unit) => {
                    this.units[unit.id] = new Contestant(this, unit);
                    this.applyTowers(unit);
                });
                break;
            case SkillUsed:
                this.current.useSkill(event.skillId, event.targetId, this.units);
                break;
            case GloryTowersApplied:
            case GuildFlagsApplied:
                this.units[event.id].applyPermanentStats(event);
                break;
            case TurnStarted:
                this.current = this.units[event.id];
            case DmgReceived:
            case Tick:
            case SkillCasted:
                this.units[event.id].apply(event);
                break;
            default:
                throw new Error(`Unknown Event: "${event.constructor.name}"`);
        }
    }

    applyEvent(event) {
        this.when(event);
        this.version += 1;
    }

    causes(event) {
        this.events.push(event);
        this.applyEvent(event);
    }
}

describe('Battle', () => {
    it("starts", () => {
        let battle = new Battle("battle-id");

        const slowUnit = {
            id: 'slow-unit-id',
            element: WATER,
            player: 'player-id',
            hp: 1000,
            atk: 100,
            def: 100,
            spd: 100,
            cr: 15,
            cd: 50,
            res: 15,
            acc: 0,
            skills: [1]
        };
        const fastUnit = {
            id: 'fast-unit-id',
            element: WIND,
            player: 'player-id',
            hp: 1000,
            atk: 100,
            def: 100,
            spd: 116,
            cr: 15,
            cd: 50,
            res: 15,
            acc: 0,
            skills: [1]
        };

        battle.start([slowUnit], [fastUnit], Battle.GUILD_BATTLE);

        assert.deepEqual(battle.type, Battle.GUILD_BATTLE);

        assert.include(battle.units['slow-unit-id'], {
            id: 'slow-unit-id',
            player: 'player-id',
            element: WATER,
            atb: 0,
            currentHP: 1400,
            hp: 1400,
            atk: 160,
            def: 140,
            spd: 115,
            cr: 15,
            cd: 100,
            res: 15,
            acc: 0,
        });

        assert.include(battle.units['fast-unit-id'], {
            id: 'fast-unit-id',
            player: 'player-id',
            element: WIND,
            atb: 0,
            currentHP: 1400,
            hp: 1400,
            atk: 160,
            def: 140,
            spd: 133.4,
            cr: 15,
            cd: 100,
            res: 15,
            acc: 0,
        });

        const nextUnit = battle.next();

        assert.deepEqual(nextUnit, { id: 'fast-unit-id', skills: { 0: 0 } }, 'fastest unit should get a turn');

        battle.cast(0, 'slow-unit-id');

        assert.equal(battle.units['slow-unit-id'].currentHP, 835);
    });

    describe('Generic Skill', () => {
        it('casts dmg to target', () => {
            const skill = GetSkill(1);

            const battle = new Battle('test');

            const target = new Contestant(battle, {
                id: 'target-id',
                player: 'player-1',
                element: 'wind',
                hp: 1000,
                atk: 100,
                def: 100,
                spd: 100,
                cr: 15,
                cd: 75,
                res: 15,
                acc: 0,
                skills: [1],
            });
            const caster = new Contestant(battle, {
                id: 'caster-id',
                player: 'player-2',
                element: 'wind',
                hp: 1000,
                atk: 100,
                def: 100,
                spd: 100,
                cr: 15,
                cd: 75,
                res: 15,
                acc: 0,
                skills: [1],
            });

            battle.units = {
                'caster-id': caster,
                'target-id': target,
            };

            skill.cast(caster, 'target-id', battle.units);

            assert.deepEqual(battle.units['target-id'].currentHP, 634);
        });
    });
});
