// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1244
/** 
When struck with a critical hit, reduces critical damage by half and removes all harmful effects. Additionally, it will recover 10% of its maximum HP each turn. [Automatic Effect]  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1244, spec.meta, multistep(spec.action))
}
