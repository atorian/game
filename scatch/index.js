import _ from 'lodash';

class Unit {
    constructor(name) {
        this.name = name;
    }
}

class Skill {
    constructor(cooldown) {
        this.cooldown = cooldown;
        this.current_cd = 0
    }

    isOnCooldown() {
        return this.current_cd > 0;
    }

    reduce(turns = 1) {
        this.current_cd = Math.max(0, Math.min([this.cooldown, this.current_cd - turns]));
    }

    reset() {
        this.current_cd = 0;
    }

    apply(unit) {
        // ???
        this.current_cd = this.cooldown;

        unit.apply(this);
    }
}

class UnitA extends Unit {
    constructor() {
        super('UnitA');
        this.stats = {
            atk: 1,
            def: 5,
            hp: 10,
            spd: 1,
        };
        this.skills = [
            new Skill(1),
            new Skill(3),
            new Skill(6),
        ];
    }
}

class UnitB extends Unit {
    constructor() {
        super('UnitB');
        this.stats = {
            atk: 1,
            def: 5,
            hp: 10,
            spd: 5,
        };

        this.skills = [
            new Skill(1),
            new Skill(3),
            new Skill(6),
        ];
    }
}

class UnitC extends Unit {
    constructor() {
        super('UnitC');
        this.stats = {
            atk: 1,
            def: 5,
            hp: 10,
            spd: 8,
        };

        this.skills = [
            new Skill(1),
            new Skill(3),
            new Skill(6),
        ];
    }
}

class UnitD extends Unit {
    constructor() {
        super('UnitD');
        this.stats = {
            atk: 1,
            def: 5,
            hp: 10,
            spd: 2,
        };

        this.skills = [
            new Skill(1),
            new Skill(3),
            new Skill(6),
        ];
    }
}

class UnitE extends Unit {
    constructor() {
        super('UnitE');
        this.stats = {
            atk: 1,
            def: 5,
            hp: 10,
            spd: 4,
        };

        this.skills = [
            new Skill(1),
            new Skill(3),
            new Skill(6),
        ];
    }
}

class UnitF extends Unit {
    constructor() {
        super('UnitF');
        this.stats = {
            atk: 1,
            def: 5,
            hp: 10,
            spd: 12,
        };

        this.skills = [
            new Skill(1),
            new Skill(3),
            new Skill(6),
        ];
    }
}

class Team {
    constructor(player, ...units) {
        this.player = player;
        this.units = units;
    }
}

class Player {
    /* */
}

class HumanPlayer extends Player {
    constructor(name) {
        super();
        this.name = name;
    }

    pickTeam() {
        // return some team;
    }

    go(permissions) {
        return _.sample(permissions);
    }
}

class Action {
    unit;
    skill;
    targets;

    constructor(unit, skill, targets) {
        this.unit = unit;
        this.skill = skill;
        this.targets = targets;
    }
}

class BattlingState {
    constructor(actionBar, players) {
        this.actionBar = actionBar;
        this.players = players;
    }

    getActions(unit) {
        const player = this.players.get(unit);

        const actions = [];
        for (const u of this.players.keys()) {
            if (this.players.get(u) !== player) {
                actions.push(new Action(unit, 1, [u]));
            }
        }

        return actions;
    }

    isGoing() {
        return true;
    }

    i = 10;
    apply(action) {
        while(this.i > 0) {
            this.i -= 1;
            return this;
        }

        return new EndedBattle();
    }

    next() {
        let unit = null;
        const units = [...this.players.keys()];

        while (!unit || unit.actionPoints < this.actionBar) {
            units.forEach(u => u.tick());
            unit = units.reduce(
                (fastest, next) => fastest.actionPoints > next.actionPoints ? fastest : next,
                {actionPoints: 0}
            );
        }

        unit.actionPoints = 0;

        return [this.players.get(unit), unit];
    }
}

class EndedBattle {

    apply(action) {
        return this;
    }

    getActions() {
        return [];
    }

    isGoing() {
        return false;
    }

    next() {
        throw new Error('Battle is over');
    }
}

class AliveUnit {
    constructor(unit) {
        this.unit = unit;
        this.currentStats = {...unit.stats};
        this.actionPoints = 0;

        this.cooldowns = new Map();
        for (const skill of this.unit.skills) {
            this.cooldowns.set(skill, skill.cooldown);
        }

        // holds cooldowns, buffs, etc
    }

    isAlive() {
        return true;
    }

    tick() {
        this.actionPoints += this.unit.stats.spd;
        // reduce cooldowns
        this.unit.skills.forEach(s => s.reduce());
    }

    apply(action) {
        // can return Alive or Dead unit
        
    }
}

class DeadUnit {
    constructor(unit) {
        this.unit = unit;
        this.currentStats = {...unit.stats, hp: 0};
        this.actionPoints = 0;
        // holds cooldowns, buffs, etc
    }

    isAlive() {
        return false;
    }

    tick() {
        this.actionPoints = 0;
    }

    apply(action) {
        // can return Alive or Dead unit
        // todo: implement resurect
    }
}


class PvpBattle {
    constructor(team1, team2) {
        this.team1 = team1;
        this.team2 = team2;

        this.players = new Map();
        for (const u of this.team1.units) {
            this.players.set(new AliveUnit(u), this.team1.player);
        }
        for (const u of this.team2.units) {
            this.players.set(new AliveUnit(u), this.team2.player);
        }

        const actionBar = Math.max(
            ...team1.units.map(u => u.spd),
            ...team2.units.map(u => u.spd)
        );

        this.state = new BattlingState(actionBar, this.players);
        this.log = [];
    }

    async start() {

        do {
            const [player, unit] = this.state.next();
            console.log(player.name, unit.unit.name);
            /* possible actions */
            const actions = unit.skills;

            const action = await player.go(
                this.state.getActions(unit)
            );

            this.log.push(action);

            this.state = this.state.apply(action);

        } while (this.state.isGoing());

        const units = [...this.players.keys()];
        const winners = units.reduce((survived, unit) => {
            if (unit.isAlive()) {
                survived.add(this.players.get(unit));
            }

            return survived;
        }, new Set());

        if (winners.size > 1) {
            console.log('Battle ended as a draw!');
        } else {
            console.log(`Player ${[...winners][0].name} won!`);
        }
    }
}

class AI extends Player {
    constructor() {
        super();
        this.name = 'AI';
    }
    go(permissions) {
        return _.sample(permissions);
    }
}

const player1 = new HumanPlayer('User');
const player2 = new AI();

const team1 = new Team(
    player1,
    new UnitA(),
    new UnitB(),
    new UnitC(),
);

const team2 = new Team(
    player2,
    new UnitD(),
    new UnitE(),
    new UnitF(),
);

const battle = new PvpBattle(team1, team2);

battle.start();

const skill = {
    id: 'str',
    harmful_effect_chance: 15,
    max_cooldown: 3,
    steps: [
        {
            target_dmg: 'self.atk * 400 + target.effects.length',
            aoe: true
            none_glance: true,
            crushing: true,
            self_dmg: 'self.hp * 15%',
            allyes_dmg: 'ally.hp * 15%',
            ignore_def: 'self.hp <= 30%' | true | 'self.def >= target.def',
            target_effects:[
                {
                    effect: 'def break',
                    duration: 3,
                },
                {
                    effect: 'stun',
                    guard: 'target.hp <= 30',
                    resistable: false,
                }
            ],
            self_effects: [
                {
                    effect: 'stun',
                    resistable: false,
                },
                {
                    effect: 'def buf',
                    duration: 3
                }
            ],
            ally_effects: [

            ]
        },
        {
            guard: 'if_no_debufs' | 'crit_chance'
            dmg: multiplier
        },
        {},
    ]
};


