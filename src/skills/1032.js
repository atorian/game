// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1032
/** 
Removes all harmful effects on all allies, granting them Immunity for 3 turns, and increasing the Attack Bar by 30%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1032, spec.meta, multistep(spec.action))
}
