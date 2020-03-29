// @flow
import type { Ability } from "../index"
import { step, targetAllies, strip, multistep, GenericSkill } from "../skill"

// skill id: 1214
/** 
Removes all harmful and beneficial effects of all allies and enemies and increases the Attack Bar of all allies by 30%. This effect can't be resisted.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies, strip(roll, 10, 100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1214, spec.meta, multistep(spec.action))
}
