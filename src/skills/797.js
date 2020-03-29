// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 797
/** 
Increases the enemy's chances of landing a Glancing Hit on an ally target by 20%, and recovers an ally with the lowest HP ratio by 10%. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(797, spec.meta, multistep(spec.action))
}
