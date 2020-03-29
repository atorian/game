// @flow
import type { Ability } from "../index"
import { step, targetSelf, multistep, GenericSkill } from "../skill"

// skill id: 1919
/** 
Your Monster will reach the MAX Lv. of the current grade when you use this as a power-up material. You can't use it on the MAX Lv. Monster. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetSelf)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1919, spec.meta, multistep(spec.action))
}
