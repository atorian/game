import { debuf, GenericSkills, simpleAtkDmg, step, targetEnemy } from "./skills";
import _ from 'lodash';

function roll() {
    return _.random(1, 100);
}

GenericSkills.set(3602, {
    action: [
        step(
            targetEnemy,
            simpleAtkDmg(roll, (atk) => atk * 3.6),
            debuf(roll, 'stun', 1, 15),
        )
    ],
    meta: {
        dmg: 30,
        effect: 35,
        cooldown: 0,
    },
});
