// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 892
/** 
Elongates the harmful effect on the enemy for 1 turn and decreases the duration of beneficial effect by 1 turn when you attack. Damage is increased by 30% if the enemy's HP is below 50%. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 60
        // fixme: Unknown effect: 68
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(892, spec.meta, multistep(spec.action))
}
