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

// skill id: 586
/** 
Strikes the enemy's weak spot with an axe, disturbing the enemy's HP recovery for 2 turns, while recovering your HP by 35%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.atk * 8.2),
                debuff(roll, "heal_block", 2, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(586, spec.meta, multistep(spec.action))
}
