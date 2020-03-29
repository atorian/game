// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    heal,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 458
/** 
Pierces the enemy's soul, disturbing the enemy's HP recovery for 2 turns, and recovering 35% HP if the enemy dies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.atk * 6.3),
                debuff(roll, "heal_block", 2, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(458, spec.meta, multistep(spec.action))
}
