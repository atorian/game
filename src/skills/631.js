// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 631
/** 
Inflicts damage proportional to the MAX HP to all enemies and reduces their Attack Bars by 30%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemies, atbDecrease(roll, undefined))],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(631, spec.meta, multistep(spec.action))
}
