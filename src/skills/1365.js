// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1365
/** 
Increases your skill activation chance by 20% and the enemies can't Resist the skill effects you apply on them. Silences the target for 1 turn whenever you attack. [Automatic Effect] 
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
    return new GenericSkill(1365, spec.meta, multistep(spec.action))
}
