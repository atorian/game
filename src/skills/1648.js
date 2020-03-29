// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, buff, multistep, GenericSkill } from "../skill"

// skill id: 1648
/** 
Removes harmful effects of an ally target, recovers the HP of all allies by 20% each, and grants immunity for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("immunity", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 20,
        },
    }
    return new GenericSkill(1648, spec.meta, multistep(spec.action))
}
