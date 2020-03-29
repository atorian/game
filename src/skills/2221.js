// @flow
import type { Ability } from "../index"
import { step, targetAllies, heal, multistep, GenericSkill } from "../skill"

// skill id: 2221
/** 
Fills the Attack Bar of all allies by 30% and recovers their HP by 35%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 10,
            atbIncrease: 0.1,
        },
    }
    return new GenericSkill(2221, spec.meta, multistep(spec.action))
}
