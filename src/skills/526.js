// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 526
/** 
Gains immunity against Continuous Damage and decreases the attacker's Attack Speed for 2 turns with a 50% chance when attacked. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(526, spec.meta, multistep(spec.action))
}
