// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 86
/** 
Revives a dead ally and recovers the HP of all allies by 20% each. If there are no allies revived by this skill, the cool down decreases by 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
            recovery: 30,
        },
    }
    return new GenericSkill(86, spec.meta, multistep(spec.action))
}
