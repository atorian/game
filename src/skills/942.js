// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    debuff,
    targetSelf,
    heal,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 942
/** 
Attacks without waking up the enemy that's under Sleep. Attacks the target 4 times to recover 50% of the inflicted damage as HP, and absorbing 15% of the enemy's Attack Bar. Puts the enemy to sleep for 2 turns when the enemy's Attack Bar is empty. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If ATB reduced to 0
        action: [
            step(targetEnemy, debuff(roll, "sleep", 2, 100)),
            step(targetEnemy, debuff(roll, "sleep", 2, 100)),
            step(targetEnemy, debuff(roll, "sleep", 2, 100)),
            step(targetEnemy, debuff(roll, "sleep", 2, 100)),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.5),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(942, spec.meta, multistep(spec.action))
}
