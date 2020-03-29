// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    debuff,
    buff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1673
/** 
Increase the enemy's chances of landing a Glancing Hit by 15% and decreases the chances of being inflicted with a critical hit by 50% on yourself additionally when allies are attacked. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetAllies,
                debuff(roll, "glancing", null, 100),
                buff((self, target) => target.buf("anti_cr", null)),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("anti_cr", null)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1673, spec.meta, multistep(spec.action))
}
