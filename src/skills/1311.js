// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1311
/** 
This monster is a good Evolving material. Always born at the MAX Level, this monster is ready to Evolve at birth. The monster will go back to Level 1 like all the other monsters if you Evolve it. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 47
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1311, spec.meta, multistep(spec.action))
}
