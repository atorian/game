// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, buff, multistep, GenericSkill } from "../skill"

// skill id: 132
/** 
Recovers the HP of all allies by 20% and recovers the ally with the lowest HP by 20% one more time. Grants immunity on the allies with full HP for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Ally with lowest HP
        // fixme: If ally at full HP
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("immunity", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 20,
        },
    }
    return new GenericSkill(132, spec.meta, multistep(spec.action))
}
