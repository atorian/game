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

// skill id: 923
/** 
Recovers the allies and increases the Attack Power for 3 turns. The recovery power is in proportion to the Attack Power. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                heal((self, target) => self.atk * 2.5),
                buff((self, target) => target.buf("atk", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 25,
        },
    }
    return new GenericSkill(923, spec.meta, multistep(spec.action))
}
