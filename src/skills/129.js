// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    heal,
    buff,
    cleanse,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 129
/** 
Removes 2 harmful effects of all allies and recovers the HP of all allies by 20%. Grants immunity on the allies who had no harmful effects for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If no harmful effects cleansed
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
                buff((self, target) => target.buf("immunity", 2)),
                cleanse(2),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 30,
        },
    }
    return new GenericSkill(129, spec.meta, multistep(spec.action))
}
