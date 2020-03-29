// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    debuff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 809
/** 
Puts the enemy to sleep for 2 turns. Instantly recovers a turn when used. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemy, debuff(roll, "sleep", 2, 100)),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(809, spec.meta, multistep(spec.action))
}
