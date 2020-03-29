// @flow
import type { Ability } from "../index"
import { step, targetSelf, heal, buff, multistep, GenericSkill } from "../skill"

// skill id: 2186
/** 
Recovers your HP by 35% and increases Defense for 2 turns. Also, recovers your HP by 15% each turn for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetSelf,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("def", 2)),
                buff((self, target) => target.buf("hot", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 20,
        },
    }
    return new GenericSkill(2186, spec.meta, multistep(spec.action))
}
