// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    heal,
    cleanse,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1430
/** 
Removes up to 2 harmful effects of an ally with the lowest HP and heals 10% of the ally's HP in each turn. [Automatic Effect]  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Ally with lowest HP
        // fixme: Ally with lowest HP
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
                cleanse(2),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1430, spec.meta, multistep(spec.action))
}
