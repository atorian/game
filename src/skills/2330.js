// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 2330
/** 
If your HP status is higher than the enemy's, your attack will deal additional damage that is proportionate to your MAX HP and increase the target's skill cooldown time by 1 turn each. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: If Self HP % greater than target
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2330, spec.meta, multistep(spec.action))
}
