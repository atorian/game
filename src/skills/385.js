// @flow
import type { Ability } from "../index"
import { step, targetAllies, heal, multistep, GenericSkill } from "../skill"

// skill id: 385
/** 
Extends the time of the beneficial effects and shortens the time of the harmful effects granted on all allies, and recovers their HP by 10% each. The recovery amount increases by 5% per harmful effect or beneficial effect granted on the allies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 53
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 30,
        },
    }
    return new GenericSkill(385, spec.meta, multistep(spec.action))
}
