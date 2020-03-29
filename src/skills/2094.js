// @flow
import type { Ability } from "../index"
import { step, targetEnemy, heal, multistep, GenericSkill } from "../skill"

// skill id: 2094
/** 
Attacks the enemy while ignoring the enemy's Defense by 15% for every Knowledge you have whenever you attack. If you have 5 Knowledge, uses all of your Knowledge to attack while ignoring the enemy's Defense. In addition, if you get defeated while having Knowledge, you will use all of your Knowledge to be revived with 20% HP per Knowledge used. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 72
        // fixme: Ignore 15% per Knowledge. All if 5 Knowledge.
        // fixme: If have Knowledge on death
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 8,
        },
    }
    return new GenericSkill(2094, spec.meta, multistep(spec.action))
}
