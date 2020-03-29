// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    debuff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1341
/** 
Attacks all enemies with a deadly wrath, dealing damage proportionate to your MAX HP, and Brands them for 2 turns. In addition, creates a shield that's equivalent to 20% of the inflicted damage on yourself for 2 turns. The cooldown time of [Deadly Wrath] will be reset if an ally gets defeated while the skill is on cooldown. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If ally is defeated
        action: [
            step(targetAlly, debuff(roll, "brand", 2, 100)),
            step(targetSelf),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1341, spec.meta, multistep(spec.action))
}
