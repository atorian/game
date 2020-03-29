// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 285
/** 
Attacks with another ally and weakens the defense for 2 turns with a 75% chance. The damage is proportionate to my MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(285, spec.meta, multistep(spec.action))
}
