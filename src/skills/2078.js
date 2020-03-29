// @flow
import type { Ability } from "../index"
import { step, targetSelf, heal, buff, multistep, GenericSkill } from "../skill"

// skill id: 2078
/** 
Returns to the hall of the fighters at the moment of death to be revived with 30% HP and increases the Attack Power and Defense for 3 turns. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetSelf,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("atk", 3)),
                buff((self, target) => target.buf("def", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 8,
        },
    }
    return new GenericSkill(2078, spec.meta, multistep(spec.action))
}
