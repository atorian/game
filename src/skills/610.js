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

// skill id: 610
/** 
Recovers your HP by 25% and provokes the enemy for 1 turn with a 75% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.maxHp * undefined),
                debuff(roll, "provoke", 1, 75),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 25,
            cooldown: 3,
            recovery: 20,
        },
    }
    return new GenericSkill(610, spec.meta, multistep(spec.action))
}
