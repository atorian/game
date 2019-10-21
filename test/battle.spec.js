import { assert } from 'chai';
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
  // skills: {[number]: Ability}
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

const Element = {
  WIND: 'wind',
  FIRE: 'fire',
  WATER: 'water',
  LIGHT: 'light',
  DARK: 'dark',
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

    switch (unit.element) {
      case Element.WIND:
        res.atk = res.atk + TowerMultipliers.wind_atk[towers.wind_atk - 1] * unit.atk / 100;
        break;
      case Element.FIRE:
        res.atk = res.atk + TowerMultipliers.fire_atk[towers.fire_atk - 1] * unit.atk / 100;
        break;
      case Element.WATER:
        res.atk = res.atk + TowerMultipliers.water_atk[towers.water_atk - 1] * unit.atk / 100;
        break;
      case Element.LIGHT:
        res.atk = res.atk + TowerMultipliers.light_atk[towers.light_atk - 1] * unit.atk / 100;
        break;
      case Element.DARK:
        res.atk = res.atk + TowerMultipliers.dark_atk[towers.dark_atk - 1] * unit.atk / 100;
        break;
    }

    return res;
  }
};

const GuildFlags = {
  apply(unit) {
    return {}
  }
};

const Skills = {
  1: {
    maxCooldown: 0,
    cooldown: 0,
    cast(battle, selectedTarget) {
      const target = battle.units[selectedTarget];
      battle.dmg(target.id, 1);
    },
    refresh(turns: number = 1) {
      this.cooldown = Math.max(0, this.cooldown - turns)
    },
    subscribe(battle: Battle) {
        battle.onTurnStarted(this.cast);
    }
  }
};

class Contestant {

  constructor(unit: Unit) {
    const { id, element, player, skills, ...stats } = unit;

    this.id = id;
    //
    this.element = element;
    this.player = player;
    //
    this.hp = stats.hp;
    this.atk = stats.atk;
    this.def = stats.def;
    this.spd = stats.spd;
    this.cr = stats.cr;
    this.cd = stats.cd;
    this.acc = stats.acc;
    this.res = stats.res;
    //
    this.base = stats;
    //
    this.atb = 0;

    skills.forEach(s => {
        this.skills[s] = Skills.new(s);
    });
  }

  cast(skillId) {
    return this.skills[skillId].reset()
  }

  permanentBuff(stats: Stats) {
    const { id, ...rest } = stats;
    for (const stat in rest) {
      this[stat] += stats[stat];
      this.base[stat] += stats[stat];
    }
  }

  tick() {
    return this.atb + (1 * (this.spd * 0.07).toFixed(2));
  }

  startTurn() {
    this.atb = 0;
    this.skills.forEach(s => s.refresh(1));
  }

  subscribePassives(battle) {
      this.skills.forEach(s => s.subscribe(battle));
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
    this.causes({
      eventType: 'glory-towers',
      unit: {
        id: unit.id,
        ...GloryTowers.apply(unit),
      },
    });

    if (this.type === Battle.GUILD_BATTLE) {
      this.causes({
        eventType: 'glory-towers',
        unit: {
          id: unit.id,
          ...GuildFlags.apply(unit),
        },
      });
    }
  }

  start(teamA: Unit[], teamB: Unit[], type) {
    this.causes({ eventType: 'battle-started', type, teamA, teamB });
  }

  next() {
    for (const id in this.units) {
      this.causes({
        eventType: "tick",
        unit: {
          id: id,
          atb: this.units[id].tick(),
        }
      });
    }

    const next = Object.values(this.units)
      .filter(u => u.atb >= Battle.ATB_SIZE)
      .sort((a, b) => a.atb - b.atb)
      .pop();

    if (!next) {
      return this.next();
    }

    this.causes({
      eventType: "turn-started",
      unit: {
        id: next.id,
      }
    });

    return true;
  }

  cast(skillId, targetId) {
    this.current.cast()
  }

  when({ eventType, ...payload }) {
    switch (eventType) {
      case "prepared":
        this.type = payload.type;
        break;
      case "battle-started":
        this.started = true;
        this.type = payload.type;
        [...payload.teamA, ...payload.teamB].forEach((unit) => {
          const c = new Contestant(unit);
          this.units[unit.id] = c;
          this.applyTowers(unit);
          c.subscribePassives(this);
        });
        break;
      case "glory-towers":
        this.units[payload.unit.id].permanentBuff(payload.unit);
        break;
      case "tick":
        this.units[payload.unit.id].atb = payload.unit.atb;
        break;
      case "turn-started":
        this.current = this.units[payload.unit.id];
        this.current.startTurn();

        this.turnStarted.forEach(listener => listener(this));

        break;
      default:
        throw new Error(`Unknown event: ${eventType}`);
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
      element: 'water',
      player: 'player-id',
      hp: 1500,
      atk: 100,
      def: 100,
      spd: 100,
      cr: 15,
      cd: 50,
      res: 15,
      acc: 0,
    };

    const fastUnit = {
      id: 'fast-unit-id',
      element: 'wind',
      player: 'player-id',
      hp: 1500,
      atk: 100,
      def: 100,
      spd: 116,
      cr: 15,
      cd: 50,
      res: 15,
      acc: 0,
    };

    battle.start([slowUnit], [fastUnit], Battle.GUILD_BATTLE);

    assert.deepEqual(battle.type, "guild_battle");
    assert.deepEqual(battle.units, {
      'slow-unit-id': {
        id: 'slow-unit-id',
        player: 'player-id',
        element: 'water',
        atb: 0,
        base: {
          hp: 1800,
          atk: 140,
          def: 120,
          spd: 115,
          cr: 15,
          cd: 75,
          res: 15,
          acc: 0,
        },
        hp: 1800,
        atk: 140,
        def: 120,
        spd: 115,
        cr: 15,
        cd: 75,
        res: 15,
        acc: 0,
      },
      'fast-unit-id': {
        id: 'fast-unit-id',
        player: 'player-id',
        element: 'wind',
        atb: 0,
        base: {
          hp: 1800,
          atk: 140,
          def: 120,
          spd: 133.4,
          cr: 15,
          cd: 75,
          res: 15,
          acc: 0,
        },
        hp: 1800,
        atk: 140,
        def: 120,
        spd: 133.4,
        cr: 15,
        cd: 75,
        res: 15,
        acc: 0,
      }
    });

    battle.next();

    assert.equal(battle.current.id, 'fast-unit-id', 'fastest unit should get a turn');
    assert.equal(battle.current.atb, 0, 'atb should be reseted when turn starts');

    battle.cast(1, 'slow-unit-id');

    assert.equal(battle.units['slow-unit-id'].hp, 100);
  });
});
