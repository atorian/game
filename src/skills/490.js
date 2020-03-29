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

// skill id: 490
/** 
Pierces an enemy with the light of retribution. This attack receives a 50% Critical Rate bonus, and stuns the enemy for 1 turn when this attack lands as a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.5),
                debuff(roll, "stun", 1, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(490, spec.meta, multistep(spec.action))
}
