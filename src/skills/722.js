// @flow
import type { Ability } from "../index"
import { step, targetEnemy, strip, multistep, GenericSkill } from "../skill"

// skill id: 722
/** 
Cancels incoming damage with a 25% chance. 1 Beneficial Effect on the targeted enemy will be removed everytime you perform an attack. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy, strip(roll, 10, 100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(722, spec.meta, multistep(spec.action))
}
