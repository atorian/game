// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 925
/** 
Throws a fan to attack the enemy 3 times, with each attack having a 50% chance to remove one of the enemy's beneficial effect. Increases the Attack Bar of all allies by 15% each per beneficial effect removed. The damage is proportionate to the attack speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Per buff removed
        action: [
            step(
                targetAllies,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 66)) / 99,
                ),
                strip(roll, 10, 100),
            ),
            step(
                targetAllies,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 66)) / 99,
                ),
                strip(roll, 10, 100),
            ),
            step(
                targetAllies,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 66)) / 99,
                ),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(925, spec.meta, multistep(spec.action))
}
