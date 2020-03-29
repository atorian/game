// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1450
/** 
Attacks the enemy with an irresistible attack to put the target's skill on MAX cooldown and sets the Attack Bar of all enemies to 0. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.4),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1450, spec.meta, multistep(spec.action))
}
