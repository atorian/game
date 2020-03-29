// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 141
/** 
Unleashes an accurately aimed deadly thrust. This attack receives a 50% Critical Rate bonus. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(141, spec.meta, multistep(spec.action))
}
