// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    atbDecrease,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2415
/** 
The Attack Speed increases by 35% for each time an enemy gains a turn, up to 5 times. The increased Attack Speed resets when your turn ends. In addition, decreases the enemy's Attack Bar by 30% with each attack. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Each tim enemy gets a turn
        // fixme: Each attack
        action: [
            step(targetEnemy, atbDecrease(roll, undefined)),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", 35)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2415, spec.meta, multistep(spec.action))
}
