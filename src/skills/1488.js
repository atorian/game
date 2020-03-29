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

// skill id: 1488
/** 
Recovers the HP of all allies by 15% each and increases their Attack Speed for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                heal((self, target) => target.maxHp * 0.15),
                buff((self, target) => target.buf("spd", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 30,
        },
    }
    return new GenericSkill(1488, spec.meta, multistep(spec.action))
}
