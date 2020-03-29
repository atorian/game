// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 847
/** 
Increases your Critical Damage by 50%. Increases the chances of receiving a Glancing Hit by 30% and gains Invincible effect for 1 turn if you're attacked with a Glancing Hit. [Automatic Effect] 
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
    return new GenericSkill(847, spec.meta, multistep(spec.action))
}
