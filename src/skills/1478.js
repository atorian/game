// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1478
/** 
Reduces incoming damage by 40% when your HP falls below 50%. [Automatic Effect] 
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
    return new GenericSkill(1478, spec.meta, multistep(spec.action))
}
