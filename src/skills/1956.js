// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1956
/** 
Inflicts Continuous Damage for 1 turn with a 50% chance and additional damage that's proportionate to the enemy's MAX HP with every attack. Boomerang Warrior's attacks will also inflict additional damage that's proportionate to the enemy's MAX HP when they attack together. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Cant parse dmg multiplier: Target MAX HP
        // fixme: When ehemy has debuffs
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1956, spec.meta, multistep(spec.action))
}
