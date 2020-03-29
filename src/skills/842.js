// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 842
/** 
Attacks the enemy target to decrease the Attack Speed for 2 turns and stuns the target for 1 turn with an 80% chance each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "slow", 2, 60),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(842, spec.meta, multistep(spec.action))
}
