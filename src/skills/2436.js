// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 2436
/** 
MAX HP will be decreased by 50% and Attack Speed by 15% when you dismount the beast. The inflicted damage on the enemy will be increased by 100%. [Automatic Effect] 
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
    return new GenericSkill(2436, spec.meta, multistep(spec.action))
}
