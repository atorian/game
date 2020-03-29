// @flow
import type { Ability } from "../index"
import { step, targetAllies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1019
/** 
Attacks leave a Branding Effect that lasts for 2 turns, and heal all allies for 30% of the damage done. Also, absorbs the Attack Bar of the enemy by 15% with each attack. 
[Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAllies, debuff(roll, "brand", 2, 100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1019, spec.meta, multistep(spec.action))
}
