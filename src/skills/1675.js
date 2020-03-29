// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1675
/** 
Transforms into a Human Form and you'll be able to use a new skill. The Attack Speed will be increased proportionate to your MAX HP in Human Form, but your MAX HP will be decreased by 30%. Instantly gains another turn after the transformation. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1675, spec.meta, multistep(spec.action))
}
