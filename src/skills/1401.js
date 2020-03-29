// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1401
/** 
If the turn ends without attacking any enemy, a shield that is proportionate to your level and lasts for 3 turns is generated. While having the shield, all damage you deal is increased by 50%. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
            shield: 0.30000000000000004,
        },
    }
    return new GenericSkill(1401, spec.meta, multistep(spec.action))
}
