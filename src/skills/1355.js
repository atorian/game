// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 1355
/** 
Increases the other allies' Attack Bar by 10% whenever your turn ends. If the allies have beneficial effects, additionally increases the Attack Bar based on the number of beneficial effects, up to 20%. This effect does not have effect on allies that have similar skill effects. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Ally with lowest ATB
        // fixme: Ally with lowest ATB
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("atk", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1355, spec.meta, multistep(spec.action))
}
