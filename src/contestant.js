import type { Ability, Unit } from "./index";
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

const BTL = Symbol('battle');

interface BattleDispatcher {
    causes(event: Object): void;
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

    skills: Ability[];

    battle: BattleDispatcher;

    constructor(battle: BattleDispatcher, unit: Unit, skills: Ability[]) {
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
}
