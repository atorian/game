// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 2312
/** 
If your turn ends with less than 30% HP, you will be turned into a statue until the next turn starts. The target that attacks you will have its Attack Power decreased for 2 turns when the target attacks you when you are turned into a statue. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy, debuff(roll, "atk_break", 2, null))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2312, spec.meta, multistep(spec.action))
}
