// @flow
// select buttle type

// set values for:
    // arena towers - max or custom
    // build flags - max or custom
    // guild (skills + bonuses) - max or custom lvl

// select units for defending team

// select my units
// allow adjust stats/builds

// select units for defending team
// select units for attaking team

// later:
// add team and unit presets

const EventEmitter = require('events');


// interface TeamBuilder {
    
// }


class Endure {
    watch(unit, duration) {
        // subscribe for unit events
        // watch for died event
        // trigger prevent death event
        // set hp to 1
    }
}

type Ability = Skill & (TargetSkill | PassiveSkill)

type Unit = {
    id: string;
    hp: number;
    atk: number; 
    def: number;
    spd: number;
    cr: number;
    cd: number;
    res: number;
    acc: number;
    skills: {[number]: Ability}
}

type effect = {
    name: string
}

type temporal = {
    duration: number
}

type hit = {
    attacker: string,
    dmg: number,
    ignoreDef: boolean,
}


export class Contestant {

  id: string;
  events: EventEmitter;
  isSavable: boolean = true;
  isElementalKing: boolean = false;
  incomingDmg: number = 0;
  effects: Array<effect | (effect & temporal)> = [];

  hp: number;
  atk: number;
  def: number;
  spd: number;
  cr: number;
  cd: number;
  res: number;
  acc: number;

  base: Unit;

  constructor(id: string, events: EventEmitter, unit: Unit) {
    this.id = id;
    this.base = unit;
    this.events = events;
    
    for (var prop in unit) {
      if (this.hasOwnProperty(prop)) {
          // $FlowFixMe
        this[prop] = unit[prop];
      }
    }

    this.events.on("battle_started", this.prepare);
  }


    causes(event) {
        this.events.emit(event.type, event);
        this.applyEvent(event);
    }

    when(event: Event) {
        const {type, ...payload} = event;
        for (var k in payload)
            this[k] = payload[k];
    }

  prepare() {
    this.events.on("hit", this.absorbDmg);
    this.events.on("hit", this.bufferIncomingDmg);
    this.events.on("hit", this.protect);
    // this.events.on("debuf", this.onDebuf);
    // this.events.on("heal", this.onHeal);
    // this.events.on("turn_started", this.startTurn);
    this.events.on("turn_ended", this.absorbDmg);
    this.events.on("turn_ended", this.reduceEffectDuration);
    this.events.on("turn_ended", this.checkIfAlive);
  }
    
    applyEvent(event) {
        when.call(this, event);
        this.version += 1;
    }

  hit(target: string, dmg: number, ignoreDef: boolean) {
      causes.({
          type: "hit",
          target: this.id,
          unit: this.id,
          hit: "normal",
          ignoreDef,
      });
  }

  glance(target: string, dmg: number, ignoreDef: boolean) {
      causes({
          type: "hit",
          target: this.id,
          unit: this.id,
          hit: "glance",
          ignoreDef,
      });
  }

  crit(target: string, dmg: number, ignoreDef: boolean) {
      causes({
          type: "hit",
          target: this.id,
          unit: this.id,
          hit: "crit",
          ignoreDef,
      });
  }

  crush(target: string, dmg: number, ignoreDef: boolean) {
      causes({
          type: "hit",
          target: this.id,
          unit: this.id,
          hit: "crush",
          ignoreDef,
      });
  }

  bufferIncomingDmg(hit: hit) {
    this.incomingDmg = hit.dmg;
  }
  
  absorbDmg() {
    if (this.incomingDmg) {
      let finalHp = this.hp - this.incomingDmg;
      causes({ // dmg received
        type: "dmg_received",
        unit: this.id, 
        hp: Math.max(0, finalHp) 
      });
    }
  }

  reduceEffectDuration() {
    this.effects = this.effects.map(
      e => {
        if (e.duration) {
          return { ...e, duration: e.duration - 1 };
        }
        return e;
      },
    );
  }

  heal(target: string, amount: number) {
    causes({ unit: this.id, hp: Math.min(this.max_hp, this.hp + amount) });
  }

  protect(hit) {
    if (hit.ignoreDef) {
      casuses({ incomingDmg: this.reduceDmg(hit.dmg) });
    }
  }
  
  debuf() {}
  
  buff(effect, duration) {
    switch (effect) {
      case "endure":
        endure.watch(this);
      default:
        return;
    }
  }
  
  checkIfAlive() {
    if (this.hp <= 0) {
      this.die();
    }
  }
  
  die() {
    causes({ unit: this.id, dead: true });
  }
  
  endTurn() {
    // reduce duration of all effects
    causes({ name: "turn_ended", unit: this.id });
  }
}


interface Skill {
    reset():void;
    refresh():void;
}

interface TargetSkill {
    cast(caster: Contestant, target: Contestant, enemies: Array<Contestant>, allies: Array<Contestant>):void;
}

class AbstractSkill implements Skill {
    cooldown: number = 0;
    reusableIn: number = 0;

    reset() {
        this.cooldown = this.reusableIn;
    }

    refresh() {
        this.cooldown = 0;
    }
}

class MegaSmash extends AbstractSkill implements TargetSkill {

    chance: number = 50;
    multiplier: number = 140;
    cooldown: number = 0;

    constructor(level: number = 1) {
        super()
        switch(level) {
            case 6:
                this.chance += 15;
            case 5:
                this.multiplier += 5;
            case 4:
                this.multiplier += 5;
            case 3:
                this.chance += 10;
            case 2:
                this.multiplier += 5;
            case 1:
                break;
            default:
                throw new Error(`Unknown skill level: ${level}`);
        }
    }

    cast(caster: Contestant, target: Contestant, enemies: Array<Contestant>, allies: Array<Contestant>) {
        var dmg = ((caster.spd + 210)/0.7) * caster.atk;

        if (caster.isElementalKing) {
            caster.crush({
                target: target.id,
                dmg,
                ignoreDef: false,
            });
        }

        if (!hit.glancing) {
            target.debuf(target, effect, duration)
        }
    }
}

class TripleCrush extends AbstractSkill implements TargetSkill {

    chance: number = 0;
    multiplier: number = 0;
    cooldown: number = 3;

    constructor(multiplier:number = 20, chance:number = 20) {
        super()
        this.chance = multiplier;
        this.multiplier = chance;
    }

    cast(caster: Contestant, target: Contestant) {
        for (var i = 0; i < 3; i++) {
            if (caster.isElementalKing) {
                target.harm(policy, this.atk * 3.8, ignoreDef)
            }
            if (!glancing) {
                target.debuf(target, effect, duration)
            }
        }
    }
}

interface PassiveSkill {
    watch(unit: Contestant, battle: Battle): void;
}

class ElementalKing extends AbstractSkill implements PassiveSkill {

    cooldown: number = 10;

    watch(unit: Contestant, battle: Battle) {
        unit.on("damage_received", ) // trigger endure
        unit.on("oblivion") // disable hit listener, reduce cr by 15%
        // unit.off(event, listener)
    }

    protect(unit: Contestant) {
        if (unit.hp == 0 && this.cooldown == 0) {
            unit.buff('endure', 1)
        }
    }
}


export type Stats = {
    hp: number;
    atk: number; 
    def: number;
    spd: number;
    cr: number;
    cd: number;
    res: number;
    acc: number;
}



export function Theomars(stats: Stats) {
    return {
        ...stats,
        skills: [
            new MegaSmash(30, 30),
            new TripleCrush(20, 20),
            new ElementalKing(),
        ]
    }
}


// battle->act(skillId, target) {
//     skill = this.unit.skills[skillId]
//     skill.apply(allies, enemies, target)
// }

class BattleActor {
    c: any;
    constructor(u: Contestant) {
        this.c = u
    }

    subscribe(events) {
        events.on("hit", function({target, value}){
            if (target == this.c.id) {
                this.c.hp = this.c.hp - value
            }
        });

        events.on("action_ended", function() {
            this.c.dead = this.c.hp === 0
        });
    }
}

class Battle extends EventEmitter {

    constructor(temaA: Team, teamB: Team) {
        teamA.forEach(contestant => contestant.subscribe(battle));
        teamB.forEach(contestant => contestant.subscribe(battle));
    }

    next() {

    }

    apply(event) {

    }
}

export function fight(teamA: Team, teamB: Team): Battle {
    battle = new Battle();

    

    return battle
}

ui.subscribe(battle)
while (battle.nextTurn()) {
    ui.render()
}


// select teams & stats
// with teams and stats -> start battle
// while battle runs
// render battle state


/// emit hist with params
// unit.onHit(
//      reduce dmg with def
// )

// trigger invincibility
// trigger dias passive