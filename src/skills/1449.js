// @flow
import type { Ability } from "../index"
import { step, targetEnemies, multistep, GenericSkill } from "../skill"

// skill id: 1449
/** 
Goes back to the elemental realm at the moment of death and returns with 30% HP. The activation of Rageful Return deals significant damage to all enemies. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemies)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(1449, spec.meta, multistep(spec.action))
}
