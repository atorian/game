// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1406
/** 
Rapidly fires 2 shots, and may fire an additional shot by chance. The chance of firing an additional shot is equivalent to your Critical Rate. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf), step(targetSelf)],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1406, spec.meta, multistep(spec.action))
}
