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

// skill id: 1471
/** 
Ambushes the enemy to deal two strong blows and stuns the target for 1 turn if the attack lands as a Critical Hit. This skill has 30% additional Critical Rate and will deal more damage according to your Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 240)) / 60,
                ),
                debuff(roll, "stun", 1, null),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 240)) / 60,
                ),
                debuff(roll, "stun", 1, null),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1471, spec.meta, multistep(spec.action))
}
