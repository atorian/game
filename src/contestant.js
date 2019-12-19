import type { Ability, Unit, OwnedUnit } from "./index";
import { DARK, FIRE, LIGHT, WATER, WIND } from "./index";

export class TurnStarted {
    id: string;
    atb: 0;
    cooldowns: 0;

    constructor(unit: Contestant) {
        this.id = unit.id;
        this.atb = 0;
        this.cooldowns = unit.skills.map(s => {
            s.refresh(1);
            return s.cooldown;
        });
    }
}

export class Tick {
    constructor(unit: Contestant) {
        this.id = unit.id;
        this.atb = unit.atb + Math.round(unit.spd * 0.07);
    }
}

export class DmgReceived {
    constructor(unit: Contestant, dmg) {
        this.id = unit.id;
        this.currentHP = Math.max(0, Math.round(unit.currentHP - dmg));
    }
}

export class SkillCasted {
    constructor(unit: Contestant, skillId) {
        this.id = unit.id;
        this.cooldowns = {
            [skillId]: unit.skills[skillId].cooldown
        };
    }
}

interface BattleDispatcher {
    causes(event: Object): void;
}

// todo: turn ended

export class UnitDied {
    constructor(unit: Contestant) {
        this.id = unit.id;
        this.atb = 0;
        this.dead = true;
    }
}


type Effect = {
    name: string,
    duration: number,
    atk?: number,
    def?: number,
    cr?: number,
    cd?: number,
    gr?: number,
    spd?: number,
    shield?: number,
    immunity?: number,
}

class Effects {
    constructor(elements = []) {
        this.elements = elements;
    }

    count() {
        return this.elements.length;
    }

    has(name: string) {
        return this.elements.find(el => el.name === name);
    }

    add(e: Effect): void {
        if (this.has(e.name) && e.name !== 'dot') {
            // increase duration
        } else if (this.elements.length < 10) {
            // add new effect
        }
    }

    reduceDuration() {
        this.elements = this.elements.map(e => ({
            ...e,
            duration: e.duration - 1,
        })).filter(e => e.dungeon > 0)
    }

    increaseDuration() {
        this.elements = this.elements.map(e => ({
            ...e,
            duration: e.duration + 1,
        }))
    }

    affecting(stat: string): Effect[] {
        return this.elements.filter((el) => el[stat]);
    }
}

export default class Contestant {

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

    // glancing rate
    gr: number;

    // todo: could use state pattern by implementing DeadContestant and AliveContestant
    dead: false;

    skills: Ability[];

    battle: BattleDispatcher;
    effects: Effect[] = [];

    constructor(battle: BattleDispatcher, unit: OwnedUnit, skills: Ability[]) {
        this.battle = battle;
        const { id, element, player, skills: _, ...stats } = unit;

        this.id = id;
        this.element = element;
        this.player = player;
        //
        Object.assign(this, stats);
        this.currentHP = this.hp;
        //
        this.atb = 0;
        this.skills = skills;
        //
        this.effects = new Effects();
    }

    useSkill(skillId: number, targetId: string, units: Contestant[]): void {
        const skill = this.skills[skillId];
        skill.cast(this, targetId, units);
        this.battle.causes(new SkillCasted(this, skillId));
    }

    tick(): void {
        this.battle.causes(
            new Tick(this)
        );
    }

    startTurn() {
        this.battle.causes(
            new TurnStarted(this)
        );
    }

    dmg(amount) {
        this.battle.causes(
            new DmgReceived(this, amount)
        );
    }

    die() {
        this.battle.causes(
            new UnitDied(this)
        );
    }

    applyPermanentStats(extraStats: Unit) {
        const { id, ...stats } = extraStats;
        for (const i in stats) {
            this[i] += stats[i];
        }
        this.currentHP = this.hp;
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

    isDead() {
        return this.dead;
    }
}
