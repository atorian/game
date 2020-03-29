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

// skill id: 704
/** 
Drains life from a targeted enemy. The stolen HP is equivalent to 30% of your MAX HP. Also disturbs the target's HP recovery for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Duplicate debuffs
        action: [
            step(
                targetEnemy,
                heal((self, target) => self.maxHp * undefined),
                debuff(roll, "heal_block", 2, 100),
                debuff(roll, "heal_block", 2, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(704, spec.meta, multistep(spec.action))
}
