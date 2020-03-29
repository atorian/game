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

// skill id: 1639
/** 
Attacks the enemy target to absorb the Attack Bar by 15% with a 30% chance and puts the enemy to sleep for 1 turn with a 10% chance. The damage increases accordingly to your Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 60)) / 50,
                ),
                debuff(roll, "sleep", 1, 10),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1639, spec.meta, multistep(spec.action))
}
