// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    atbDecrease,
    targetSelf,
    heal,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2361
/** 
Absorbs the Attack Bar by 50% if you attack a monster with same or lower HP status compared to yours. Recovers your HP by 50% of the damage dealt if you attack a monster that has better HP status than yours. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: If Self HP % lower than target
        // fixme: If Self HP % lower than target
        // fixme: If Self HP % greater than target
        action: [
            step(targetEnemy, atbDecrease(roll, undefined)),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.5),
                atbIncrease(50),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2361, spec.meta, multistep(spec.action))
}
