// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 2079
/** 
You can't counterattack or attack together with other allies while the weapon is not in your hand, but your Defense will be increased by 50%. Also decreases the cooldown time when you're attacked. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2079, spec.meta, multistep(spec.action))
}
