// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 2362
/** 
Increases your Attack Bar by 30% and counterattacks the attacker with a critical hit when you are attacked with a critical hit. You won't get defeated with critical hit attacks. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2362, spec.meta, multistep(spec.action))
}
