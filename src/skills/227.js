// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 227
/** 
Throws 3 axes at an enemy. Your Attack Bar increases by 15% if this attack lands as a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
            ),
            step(targetSelf, atbIncrease(15)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(227, spec.meta, multistep(spec.action))
}
