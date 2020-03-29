// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1533
/** 
Quickly draws the sword to attack an enemy 2 times, with each attack having a 50% chance to decrease the target's Attack Bar by 50%. The damage increases according to your Attack Speed. This skill has a 70% chance to activate the Sword of the Supreme Sky Wolf, and the activation chance increases by 30% additionally when you land a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 150)) / 70,
                ),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 150)) / 70,
                ),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1533, spec.meta, multistep(spec.action))
}
