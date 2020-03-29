// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1273
/** 
Removes all harmful effects on all allies. After that, 3 randomly selected allies will attack an enemy target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 58
        action: [step(targetAllies), step(targetAllies), step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1273, spec.meta, multistep(spec.action))
}
