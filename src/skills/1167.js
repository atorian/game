// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    heal,
    debuff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1167
/** 
Recovers the HP of all allies by 50% by putting yourself to sleep for 1 turn. In addition, puts all enemies to sleep for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Duplicate debuffs
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
                debuff(roll, "sleep", 1, 100),
                debuff(roll, "sleep", 1, 50),
            ),
            step(targetSelf, debuff(roll, "sleep", 1, 100)),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 20,
        },
    }
    return new GenericSkill(1167, spec.meta, multistep(spec.action))
}
