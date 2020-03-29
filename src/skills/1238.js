// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    heal,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1238
/** 
Attacks an enemy and recovers HP by 30% of the inflicted damage. Becomes invincible for 1 turn when the enemy is killed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.3),
                buff((self, target) => target.buf("invincibility", 1)),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1238, spec.meta, multistep(spec.action))
}
