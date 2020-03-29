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

// skill id: 98
/** 
Recovers the HP of all allies by 25% and increases their Attack Power for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
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
    return new GenericSkill(98, spec.meta, multistep(spec.action))
}
