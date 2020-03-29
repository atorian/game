// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 1918
/** 
Removes all harmful effects on an ally target and casts a shield which is equivalent to 20% of your MAX HP for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 2,
            shield: 0.30000000000000004,
        },
    }
    return new GenericSkill(1918, spec.meta, multistep(spec.action))
}
