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


export class TurnEnded {
    constructor(unit: Contestant) {
        this.id = unit.id;
    }
}

export class Tick {
    constructor(unit: Contestant) {
        this.id = unit.id;
        this.atb = unit.atb + Math.round(unit.spd * 0.07);
    }
}

export class DmgReceived {
    constructor(unit: Contestant, dmg, kind) {
        this.id = unit.id;
        this.dmg = dmg;
        this.kind = kind;
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

export class EffectAdded {
    constructor(unit: Contestant, effect) {
        this.id = unit.id;
        this.effect = effect;
    }
}
export class EffectResisted {
    constructor(unit: Contestant, effect) {
        this.id = unit.id;
        this.resisted = effect;
    }
}

export class EffectsDurationReduced {
    id: string;
    effects: Effect[];
    constructor(unit: Contestant) {
        this.id = unit.id;
        this.effects = unit.effects.elements.map(e => {
            if (e.duration) {
                if (e.duration === 1) {
                    return null;
                }
                return {...e, duration: e.duration - 1};
            }
            return e;
        }).filter(e => e);
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

    has(name: string) {
        return this.elements.find(el => el.name === name);
    }

    hasInabilityEffects() {
        return this.elements.filter(e => ['stun', 'sleep', 'freeze'].includes(e.name)).length > 0;
    }

    add(e: Effect): void {
        if (this.has(e.name) && e.name !== 'dot') {
            const existing = this.elements.find(effect => effect.name === e.name);
            existing.duration = Math.max(existing.duration, e.duration);
        } else if (this.elements.length < 10) {
            this.elements.push(e);
        }
    }

    hasTemporalEffects() {
        return this.elements.filter(e => e.duration).length;
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
    gr: number = 0;
    antiCr: number = 0;

    // todo: could use state pattern by implementing DeadContestant and AliveContestant
    dead: false;

    skills: Ability[];

    battle: BattleDispatcher;
    effects: Effects;

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

        const canMove = !this.effects.hasInabilityEffects();
        if (this.effects.hasTemporalEffects()) {
            this.battle.causes(
                new EffectsDurationReduced(this)
            );
        }

        if (!canMove) {
            this.battle.causes(new TurnEnded(this));
        }
    }

    dmg(amount, kind) {
        this.battle.causes(
            new DmgReceived(this, amount, kind)
        );
    }

    affect(effects) {
        effects.forEach((effect) => this.battle.causes(
            new EffectAdded(this, effect)
        ));
    }

    resist(effects) {
        effects.forEach((effect) => this.battle.causes(
            new EffectResisted(this, effect)
        ));
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
        const { id, cooldowns, dmg, effect, effects, ...stats } = event;
        if (effects) {
            this.effects = new Effects();
            event.effects.forEach(e => this.effects.add(e));
        }

        if (cooldowns) {
            for (const i in cooldowns) {
                this.skills[i].cooldown = cooldowns[i];
            }
        }

        if (effect) {
            this.effects.add(effect);
        }

        Object.assign(this, stats);
    }

    isDead() {
        return this.dead;
    }
}
