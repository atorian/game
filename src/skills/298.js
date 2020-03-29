// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    buff,
    cleanse,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 298
/** 
Increases the Attack Power of all allies for 2 turns and removes 2 harmful effects. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("atk", 2)),
                cleanse(2),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(298, spec.meta, multistep(spec.action))
}
