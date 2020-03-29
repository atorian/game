// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 2413
/** 
The Attack Bar increasing skill effect granted on yourself increases by 50%, and the Attack Bar decreasing skill effect granted on yourself decreases by 50%. Also, your Attack Speed increases by 15% whenever your Attack Bar increases due to skills, up to 5 times. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Duration of buff is too big for skill 2413.
        // fixme: Each time an ATB increase is experienced
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", 15)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2413, spec.meta, multistep(spec.action))
}
