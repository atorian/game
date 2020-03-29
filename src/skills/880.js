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

// skill id: 880
/** 
Attacks the enemy with a whip, decreasing the enemy's Attack Speed for 2 turns with a 50% chance. The damage increases according to Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 80)) / 45,
                ),
                debuff(roll, "slow", 2, 50),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(880, spec.meta, multistep(spec.action))
}
