// @flow
import type { Ability } from "../index"
import { step, targetAlly, multistep, GenericSkill } from "../skill"

// skill id: 463
/** 
Removes all Harmful Effects on an ally target and also evens the HP ratio of you and the ally target. After that, both monsters are healed by 25% of their MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: Life Share
        action: [step(targetAlly)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(463, spec.meta, multistep(spec.action))
}
