// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 428
/** 
Inflicts damage to all enemies with a deadly scythe. Always lands a Critical Hit if the enemy's HP is 30% or lower. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(428, spec.meta, multistep(spec.action))
}
