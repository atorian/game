// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 190
/** 
Gains immunity against freeze and stun effects and your attacks deal additional damage proportionate to the target's MAX HP. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Against Freeze and Stun
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("immunity", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(190, spec.meta, multistep(spec.action))
}
