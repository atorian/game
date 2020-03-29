// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 688
/** 
Randomly selects an enemy 4 times to grant one of the following effects: remove a beneficial effect, stun, decrease Defense, or disturb HP recovery. Additionally, the Attack Bar of all allies will be increased by 30%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(688, spec.meta, multistep(spec.action))
}
