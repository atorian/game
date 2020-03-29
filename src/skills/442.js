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

// skill id: 442
/** 
Attacks the enemy with 2 consecutive kicks and stuns the enemy for 1 turn if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "stun", null, null),
            ),
        ],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(442, spec.meta, multistep(spec.action))
}
