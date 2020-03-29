// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 766
/** 
Creates a shield every turn to absorb incoming damage proportionate to your level. Decreases the attacker's Attack Speed for 1 turn if you're attacked when you have the shield. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(766, spec.meta, multistep(spec.action))
}
