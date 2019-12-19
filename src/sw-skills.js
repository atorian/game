import { GenericSkills, simpleAtkDmg, step, targetEnemy } from "./skills";
import _ from 'lodash';

function roll() {
    return _.random(1, 100)
}

GenericSkills.set(3602, {
    target: targetEnemy,
    action: [
        step(
            simpleAtkDmg(roll, (atk) => atk * 3.6),
            // todo: stun
        ),
    ],
    meta: {
        dmg: 0.3,
        effect: 0.25,
        cooldown: 0,
    }
});
