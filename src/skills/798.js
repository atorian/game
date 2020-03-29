// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 798
/** 
Recovers the HP of all allies by 15% each, decreases their chance of receiving a Critical Hit for 2 turns, and grants them Immunity for 2 turns as well. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
            recovery: 30,
        },
    }
    return new GenericSkill(798, spec.meta, multistep(spec.action))
}
