// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 2170
/** 
Revives a dead ally and fills up the ally's HP by 15%. Revives another ally with a 30% chance. All skills of the revived allies are ready to be used. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Chance to revive additional ally
        // fixme: Of revived targets
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(2170, spec.meta, multistep(spec.action))
}
