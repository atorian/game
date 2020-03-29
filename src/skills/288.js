// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 288
/** 
Inflicts great damage by crashing into the enemy. The damage is proportionate to my MAX HP and the enemy's MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: MAX HP,Target MAX HP
        action: [step(targetEnemy)],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(288, spec.meta, multistep(spec.action))
}
