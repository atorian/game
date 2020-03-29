// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1208
/** 
Attacks all enemies with a powerful storm. The damage increases proportionate to the enemy's attack speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: ATK,Target SPD
        action: [step(targetEnemy)],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1208, spec.meta, multistep(spec.action))
}
