// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 388
/** 
Acquires a shield that equals to 20% of your MAX HP for 2 turns when you're attacked with a Critical Hit. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
            shield: 0.30000000000000004,
        },
    }
    return new GenericSkill(388, spec.meta, multistep(spec.action))
}
