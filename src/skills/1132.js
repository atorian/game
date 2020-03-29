// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1132
/** 
Attacks and decreases the Defense for 2 turns with a 75% chance and recovers your Attack Bar by 50%.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.2),
                debuff(roll, "def_break", 2, 75),
            ),
            step(targetSelf, atbIncrease(50)),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1132, spec.meta, multistep(spec.action))
}
