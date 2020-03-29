// @flow
import type { Ability } from "../index"
import { step, targetSelf, heal, buff, multistep, GenericSkill } from "../skill"

// skill id: 1289
/** 
Circulates the body with chi to increase the Defense for 3 turns and counterattacks when you're attacked. Also, recovers your HP by 15%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetSelf,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("counterAtk", 3)),
                buff((self, target) => target.buf("def", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 25,
        },
    }
    return new GenericSkill(1289, spec.meta, multistep(spec.action))
}
