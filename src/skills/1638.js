// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1638
/** 
Rolls 2 dice to redistribute the HP ratio of the enemy according to the smaller number you get on the dice. Instantly gains another turn if you get the same number. This skill can't be used on the Boss. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 62
        action: [
            step(targetEnemy),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1638, spec.meta, multistep(spec.action))
}
