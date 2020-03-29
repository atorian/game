// @flow
import type { Ability } from "../index"
import { step, targetAllies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1031
/** 
The damage you receive decreases as more allies survive and the damage you inflict increases as more allies die. Additionally, the enemy you attack will be provoked for 1 turn. [Automatic Effect]  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetAllies, debuff(roll, "provoke", 1, 100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1031, spec.meta, multistep(spec.action))
}
