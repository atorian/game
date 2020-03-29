// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 830
/** 
Offsets the incoming damage that may cause you to die and increases your Attack Bar by 50%. This effect is activated only once in 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(830, spec.meta, multistep(spec.action))
}
