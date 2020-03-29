// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1463
/** 
Attacks the enemy 4 times to grant 1 random harmful effect among Glancing Hit Rate Increase, Attack Power Decrease, and Attack Speed Decrease with a 70% chance each. The inflicted damage is proportionate to your Defense and the MAX HP of the target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: DEF,Target MAX HP
        action: [
            step(
                targetEnemy,
                debuff(roll, "glancing", 1, 70),
                debuff(roll, "atk_break", 1, 70),
                debuff(roll, "slow", null, 70),
            ),
            step(
                targetEnemy,
                debuff(roll, "glancing", 1, 70),
                debuff(roll, "atk_break", 1, 70),
                debuff(roll, "slow", null, 70),
            ),
            step(
                targetEnemy,
                debuff(roll, "glancing", 1, 70),
                debuff(roll, "atk_break", 1, 70),
                debuff(roll, "slow", null, 70),
            ),
            step(
                targetEnemy,
                debuff(roll, "glancing", 1, 70),
                debuff(roll, "atk_break", 1, 70),
                debuff(roll, "slow", null, 70),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 30,
            cooldown: 3,
        },
    }
    return new GenericSkill(1463, spec.meta, multistep(spec.action))
}
