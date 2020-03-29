// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 587
/** 
Your Attack Power is increased by 50% and you are healed by 30% of the damage you deal. Additionally, you'll gain a shield for 1 turn by the exceeded recovery amount. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 45
        // fixme: Excess healing
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(587, spec.meta, multistep(spec.action))
}
