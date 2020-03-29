// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    debuff,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 734
/** 
Installs a bomb that goes off after 2 turns on all enemies and increases the Attack Bar by 50%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemies, debuff(roll, "bomb", 2, 100)),
            step(targetSelf, atbIncrease(50)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(734, spec.meta, multistep(spec.action))
}
