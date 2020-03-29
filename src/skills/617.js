// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 617
/** 
Removes all harmful effects on all allies and increases the attack gauge by at least 15%. The attack gauge is increased additionally by 5% for each removed harmful effect.  
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
    return new GenericSkill(617, spec.meta, multistep(spec.action))
}
