// @flow
import type { Ability } from "../index"
import { step, targetAllies, heal, multistep, GenericSkill } from "../skill"

// skill id: 1177
/** 
Recovers the HP of other allies by 10% every turn, and rises from the ashes at the moment of death with 100% HP. [Automatic Effect]  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Automatically each turn
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 8,
        },
    }
    return new GenericSkill(1177, spec.meta, multistep(spec.action))
}
