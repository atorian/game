// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    buff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1097
/** 
Gains immunity against inability effects and increases the Attack Power by 50% each time your allies are attacked or granted with harmful effects, up to 5 times. In addition, counterattacks with a 30% chance when you get attacked. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("counterAtk", null)),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1097, spec.meta, multistep(spec.action))
}
