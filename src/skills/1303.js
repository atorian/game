// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1303
/** 
As your HP decreases, the damage inflicted to the enemy will increase and the damage you receive will decrease. The damage you receive will decrease by 20% additionally if you are under harmful effects. [Automatic Effect] 
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
    return new GenericSkill(1303, spec.meta, multistep(spec.action))
}
