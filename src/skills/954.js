// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 954
/** 
Causes turbulence to set the enemy's Attack Bar to 0 and increases your Attack Bar by 50%.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6),
                atbDecrease(roll, undefined),
            ),
            step(targetSelf, atbIncrease(50)),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(954, spec.meta, multistep(spec.action))
}
