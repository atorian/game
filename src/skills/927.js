// @flow
import type { Ability } from "../index"
import { step, targetAllies, heal, multistep, GenericSkill } from "../skill"

// skill id: 927
/** 
Recovers the HP of all allies with a mysterious dance and extends the time of the beneficial effects and shortens the time of the harmful effects. The recovery amount is in proportion to the Attack Power. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 53
        action: [
            step(
                targetAllies,
                heal((self, target) => self.atk * 4),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 30,
        },
    }
    return new GenericSkill(927, spec.meta, multistep(spec.action))
}
