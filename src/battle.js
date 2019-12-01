import Contestant, {
    DmgReceived,
    SkillCasted,
    Tick,
    TurnStarted
} from "./contestant";
import { GetSkill } from "./skills";
import type { Unit } from "./index";
import { GloryTowers, GuildFlags } from "./towers";

class BattleStarted {
    constructor(battleId, type, teamA, teamB) {
        this.id = battleId;
        this.type = type;
        this.teamA = teamA;
        this.teamB = teamB;
    }
}

class SkillUsed {
    constructor(skillId, targetId) {
        this.skillId = skillId;
        this.targetId = targetId;
    }
}

export class GloryTowersApplied {
    constructor(unit: Contestant) {
        this.id = unit.id;
        Object.assign(this, GloryTowers.apply(unit));
    }
}

export class GuildFlagsApplied {
    constructor(unit: Contestant) {
        this.id = unit.id;
        Object.assign(this, GuildFlags.apply(unit));
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

export class Battle {

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
        if (this.current) return new CurrentActiveUnit(this.current);

        const units = Object.values(this.units);
        units.forEach(unit => unit.tick());

        const next = units
            .filter(u => u.atb >= Battle.ATB_SIZE)
            .sort((a, b) => a.atb - b.atb)
            .pop();

        if (!next) return this.next();
        // @todo: clean up this
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
                    this.units[unit.id] = new Contestant(this, unit, unit.skills.map(GetSkill));
                    this.applyTowers(unit);
                });
                break;
            case SkillUsed:
                this.current.useSkill(event.skillId, event.targetId, Object.values(this.units));
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
