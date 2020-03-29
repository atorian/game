// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    heal,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 767
/** 
Becomes invincible for 1 turn if your HP falls below 50% from above 50%. Drains life from the enemy whenever the enemy's turn ends while the invincible effect is activated. The stolen HP is equivalent to 10% of your MAX HP. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.maxHp * undefined),
            ),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.1),
                buff((self, target) => target.buf("invincibility", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(767, spec.meta, multistep(spec.action))
}
