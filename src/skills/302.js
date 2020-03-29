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

// skill id: 302
/** 
Strikes the enemy's camp to inflict damage on all enemies, decreasing their Attack Bar by 30%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(302, spec.meta, multistep(spec.action))
}
