// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 599
/** 
Removes harmful effects of all allies and recovers the HP by 15%. The recovery amount increases by 5% for each removed harmful effect. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 20,
        },
    }
    return new GenericSkill(599, spec.meta, multistep(spec.action))
}
