// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1052
/** 
Attacks all enemies with a spell that summons the power of darkness. This attack has a 75% chance to remove beneficial effects and a 75% chance to block beneficial effects from being granted on them for 2 turns. The damage of this skill is proportionate to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                debuff(roll, "blockBuff", 2, 75),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 4,
        },
    }
    return new GenericSkill(1052, spec.meta, multistep(spec.action))
}
