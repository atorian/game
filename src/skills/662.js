// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 662
/** 
Violently attacks the enemy 4 times to inflict damage proportionate to my MAX HP and removes a beneficial effect with a 50% chance for each attack. The cooltime resets if the enemy dies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 10,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(662, spec.meta, multistep(spec.action))
}
