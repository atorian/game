// @flow
import uuid from "uuid/v4";
import type { OwnedUnit, Unit } from "../index";
import Battle from "../battle";
import swunits from '../sw-units';
require('../sw-skills');

function playerTeam(units: Unit[], player): OwnedUnit {
    console.log('Object.keys(units).length', Object.keys(units).length);

    return Object.values(units).reduce((carry, unit, idx) => {
        carry[idx] = {
            ...swunits[unit.unitId],
            ...unit,
            player,
            id: uuid(),
        };
        return carry;
    }, new Array(Object.keys(units).length - 1));
}

export default function(battles, router) {
    return (teamA: Unit[], teamB: Unit[]) => {
        const battle = new Battle(uuid());

        console.log('teamA', teamA);
        console.log('prepared A', playerTeam(teamA));
        battle.start(
            playerTeam(teamA, 'attacker'),
            playerTeam(teamB, 'defender'),
        );

        battles.persist(battle);
        router.fightBattle(battle.id);
    }
}
