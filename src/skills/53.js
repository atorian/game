// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 53
/** 
Increases your Attack Power and Critical Rate for 3 turns. Additionally, your Attack Bar increases by 50%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("atk", 3)),
                buff((self, target) => target.buf("cr", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(53, spec.meta, multistep(spec.action))
}
