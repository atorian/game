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

// skill id: 2323
/** 
Recovers the HP of all allies by 20% each and increases their Attack Speed for 2 turns. In addition, decreases the chances of allies receiving Critical Hits for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("spd", 2)),
                buff((self, target) => target.buf("anti_cr", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 20,
        },
    }
    return new GenericSkill(2323, spec.meta, multistep(spec.action))
}
