// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 229
/** 
Throws 5 axes randomly. Each attack has a 30% chance to inflict Continuous Damage for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf)],
        meta: {
            dmg: 20,
            effect: 30,
            cooldown: 5,
        },
    }
    return new GenericSkill(229, spec.meta, multistep(spec.action))
}
