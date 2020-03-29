// @flow
import type { Ability } from "../index"
import { step, targetEnemies, multistep, GenericSkill } from "../skill"

// skill id: 420
/** 
Increases Defense by 50% and recovers 20% of the damage inflicted to the enemies as HP. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(420, spec.meta, multistep(spec.action))
}
