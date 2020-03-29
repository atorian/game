// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 693
/** 
Inflicts damage proportionate to your MAX HP on all enemies and removes the harmful effect and beneficial effect on the enemies with a 50% chance. Each enemy is put to sleep for the number of turns equal to the number of effects removed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Number of turns equal to number of debuffs removed
        action: [
            step(
                targetEnemy,
                debuff(roll, "sleep", null, 100),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(693, spec.meta, multistep(spec.action))
}
