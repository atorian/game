// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    heal,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1935
/** 
Recovers the HP of all allies by 20% each and creates a shield that's proportionate to 20% of your HP for 3 turns. Afterwards, grants immunity on the allies who have full HP for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If full HP after heal
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("immunity", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            shield: 0.2,
            recovery: 20,
        },
    }
    return new GenericSkill(1935, spec.meta, multistep(spec.action))
}
