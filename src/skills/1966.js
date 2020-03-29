// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 1966
/** 
Removes all harmful effects granted on yourself and increases your Attack Power for 2 turns. You instantly gain another turn after using the skill. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("atk", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1966, spec.meta, multistep(spec.action))
}
