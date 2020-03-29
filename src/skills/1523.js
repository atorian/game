// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 1523
/** 
Removes all harmful effects on the target ally and recovers both your HP and the target's HP by 20%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => target.maxHp * 0.2),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 2,
            recovery: 25,
        },
    }
    return new GenericSkill(1523, spec.meta, multistep(spec.action))
}
