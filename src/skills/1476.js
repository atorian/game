// @flow
import type { Ability } from "../index"
import { step, targetSelf, heal, buff, multistep, GenericSkill } from "../skill"

// skill id: 1476
/** 
Recovers your HP by 30% and increases Defense for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetSelf,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("def", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 20,
        },
    }
    return new GenericSkill(1476, spec.meta, multistep(spec.action))
}
