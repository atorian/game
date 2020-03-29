// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 2091
/** 
Gains Knowledge by the number of granted beneficial effects when you're granted with a beneficial effect. Gains 3 Knowledge when an enemy or an ally gets defeated. You can have up to 5 Knowledge. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 70
        // fixme: Unknown effect: 70
        // fixme: Per beneficial effect granted
        // fixme: On death of enemy or ally
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2091, spec.meta, multistep(spec.action))
}
