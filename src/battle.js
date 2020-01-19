import Contestant, {
    DmgReceived,
    EffectAdded, EffectResisted,
    EffectsDurationReduced,
    SkillCasted,
    Tick,
    TurnStarted,
    TurnEnded,
    UnitDied,
} from "./contestant";
import { GetSkill } from "./skills";
import type { Unit } from "./index";
import { GloryTowers, GuildFlags } from "./towers";

export class BattleStarted {
    constructor(battleId, type, teamA, teamB) {
        this.id = battleId;
        this.type = type;
        this.teamA = teamA;
        this.teamB = teamB;
    }
}

export class SkillUsed {
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

export class BattleEnded {
    constructor(winner) {
        this.ended = true;
        this.winner = winner;
    }
}

export default class Battle {

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
    ended: boolean = false;
    winner: string;

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
        if (this.ended) throw new Error('Battle is already finished.');
        if (this.current) return new CurrentActiveUnit(this.current);

        const units = Object.values(this.units);
        units.forEach(unit => unit.tick());

        const next = units
            .filter(u => u.atb >= Battle.ATB_SIZE)
            .sort((a, b) => a.atb - b.atb)
            .shift();

        if (!next) return this.next();
        // @todo: clean up this
        next.startTurn();

        return new CurrentActiveUnit(next);
    }

    cast(skillIdx, targetId) {
        // todo: revisit this
        if (this.current.skills[skillIdx].cooldown === 0) {
            this.causes(new SkillUsed(skillIdx, targetId));
            this.causes(new TurnEnded(this.current));
            Object.values(this.units).forEach(u => {
                if (u.currentHP === 0) {
                    u.die();
                }
            });
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
            case TurnEnded:
                this.current = null;
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
            case EffectsDurationReduced:
            case DmgReceived:
            case Tick:
            case SkillCasted:
            case UnitDied:
            case EffectAdded:
                this.units[event.id].apply(event);
                this.validateState();
                break;
            case BattleEnded:
                this.ended = true;
                this.winner = event.winner;
                break;
            case EffectResisted:
                // ok
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

    validateState() {
        const teamsAlive = new Set(
            Object.values(this.units)
            .filter(u => !u.isDead())
            .map(u => u.player)
        );

        if (teamsAlive.size === 1) {
            this.causes(new BattleEnded([...teamsAlive.values()][0]));
        }
    }
}
