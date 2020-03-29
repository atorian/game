// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2314
/** 
When you are turned into a statue, inflicts damage that's proportionate to your Defense to the target that attacks you. Also decreases your skill cooldown time when you get attacked with a critical hit. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy), step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2314, spec.meta, multistep(spec.action))
}
