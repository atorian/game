// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 616
/** 
Removes one harmful effect from all allies, decreases their skill cool time by 1 turn each, and increases their Attack Speed for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(616, spec.meta, multistep(spec.action))
}
