// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 387
/** 
All allies are invincible for 1 turn and gain Immunity for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(387, spec.meta, multistep(spec.action))
}
