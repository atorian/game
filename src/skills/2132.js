// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2132
/** 
Attacks all enemies with a cyclone 2 times. Each attack has a 40% chance of increasing the enemy's chance of landing a Glancing Hit for 2 turns. Also, reduces the Attack Bar by 50% if you attack an enemy under the Decrease Attack Speed effect with each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If enemy has Dec. SPD effect
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "glancing", 2, 40),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "glancing", 2, 40),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(2132, spec.meta, multistep(spec.action))
}
