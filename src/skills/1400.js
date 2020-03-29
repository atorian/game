// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 1400
/** 
Becomes immune against inability effects. Also, your Attack Power is increased by 20% for every beneficial effect on you. Your Attack Speed increases in proportion to the no. of harmful effects granted on yourself. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Duration of buff is too big for skill 1400.
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("atk", 20)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1400, spec.meta, multistep(spec.action))
}
