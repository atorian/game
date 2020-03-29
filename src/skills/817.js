// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 817
/** 
Removes all harmful effects on yourself and comes back to life with 100% HP. Additionally, you gain 50% increased Attack Power and Defense every time you use "Reincarnate". (Accumulates up to 5 times) 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(817, spec.meta, multistep(spec.action))
}
