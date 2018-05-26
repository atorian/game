// @flow

class Unit {
    constructor(runes: Runes) {
        this.runes = runes;
        this.effects = [];
        this.events = [];
    }

    buf(effect: Effect) {
        this.effects.add(effect);
    }

    debuf(effect: Effect) {
        this.effects.add(effect);
    }
}

interface Totem {
    apply(unit: Unit);
}

type Effect = {
    attr: string,
    mod: number,
}

class AncientSword implements Totem {
    constructor(lvl) {
        this.bonus = lvl * 2;
    }

    apply(unit) {
        unit.buf({
            attr: 'atk',
            mod: 20
        });
    };
}

class Player {
    totems(): Totem[] {
        return [
            new AncientSword(10),
            // new Totem('hp', 20),
        ]
    }
}


class BonusEffect {
    constructor(stat: string, value: number) {
        this.stat = stat;
        this.value = value;
    }
}


export class Team {
    player: Player;
    units: Unit;

    constructor(player: Player, units: Unit[]) {
        this.player = player;
        this.units = units;
    }
}

const Events = require('events');

export class Battlefield extends Events {
    constructor(teamA: Team, teamB: Team) {
        super();
        this.events = new Events();
        this.teams = new Map();
        this.teams.set(teamA.player, teamA.map(u => new Contestant(u, this)));
        this.teams.set(teamB.player, teamB.map(u => new Contestant(u, this)));
    }

    join(player, team) {

    }
}
