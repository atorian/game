// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1181
/** 
Attacks all enemies with a violent storm. Becomes instantly reusable if an enemy dies. Increases the Attack Bar by 20% per defeated enemy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 20% per killed enemy
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
            ),
            step(targetSelf, atbIncrease(20)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1181, spec.meta, multistep(spec.action))
}
