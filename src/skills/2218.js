// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 2218
/** 
Increases your Attack Power and counterattacks for 1 turn when you attack on your turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("atk", 1)),
                buff((self, target) => target.buf("counterAtk", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2218, spec.meta, multistep(spec.action))
}
