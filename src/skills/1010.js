// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1010
/** 
Strikes two strong blows. This attack receives a 30% Critical Rate bonus. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf), step(targetSelf)],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1010, spec.meta, multistep(spec.action))
}
