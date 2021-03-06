// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 1261
/** 
Increases your Attack Power and Critical Rate for 2 turns and instantly grants you another turn.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("atk", 2)),
                buff((self, target) => target.buf("cr", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1261, spec.meta, multistep(spec.action))
}
