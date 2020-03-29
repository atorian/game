// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 2147
/** 
Removes all harmful effects on the target ally and recovers the ally's HP by 20% of your MAX HP. 
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
            cooldown: 2,
            recovery: 20,
        },
    }
    return new GenericSkill(2147, spec.meta, multistep(spec.action))
}
