// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1399
/** 
Gains a shield that is equivalent to 20% of your MAX HP for 1 turn when being attacked by an enemy. This effect only activates once a turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
            shield: 0.2,
        },
    }
    return new GenericSkill(1399, spec.meta, multistep(spec.action))
}
