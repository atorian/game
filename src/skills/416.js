// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 416
/** 
Pursuits the enemy and inflicts a critical wound. The damage is proportionate to your MAX HP and Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: MAX HP,SPD
        action: [step(targetEnemy)],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(416, spec.meta, multistep(spec.action))
}
