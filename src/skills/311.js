// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 311
/** 
Inflicts damage that ignores the target's Defense with a 20% chance with every attack. The chance increases by 15% for every harmful effect granted on the target, up to 50%. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Chance increases 5% per harmful effect on target
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(311, spec.meta, multistep(spec.action))
}
