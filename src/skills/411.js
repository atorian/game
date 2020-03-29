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

// skill id: 411
/** 
Attacks with claws and stuns the enemy if the attack lands as a Critical Hit. The damage increases according to the Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 3.5 * (attacker.atkSpd + 50)) / 150,
                ),
                debuff(roll, "stun", 1, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(411, spec.meta, multistep(spec.action))
}
