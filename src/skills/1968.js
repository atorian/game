// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1968
/** 
Receives 20% less damage from enemies granted with beneficial effects and inflicts 20% more damage on enemies with no beneficial effects. Chakram Dancer will be granted with the same effect if she's included in the ally team. [Automatic Effect] 
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
    return new GenericSkill(1968, spec.meta, multistep(spec.action))
}
