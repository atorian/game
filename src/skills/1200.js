// @flow
import type { Ability } from "../index"
import { step, targetAllies, heal, multistep, GenericSkill } from "../skill"

// skill id: 1200
/** 
Steals the HP of all enemies by 15% of your MAX HP and steals all beneficial effects on all enemies. Increases the Attack Bar of all allies by 20% if you successfully steal beneficial effects. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If buff stolen
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1200, spec.meta, multistep(spec.action))
}
