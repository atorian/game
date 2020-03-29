// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1973
/** 
Leaves a Branding Effect for 3 turns with a 50% chance when you attack an enemy. When you defeat an enemy during your turn, the enemy can't be revived during the battle, and the cooldown time of [Dark Nova] will be decreased by 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy, debuff(roll, "brand", 3, 50))],
        meta: {
            dmg: 0,
            effect: 50,
            cooldown: 0,
        },
    }
    return new GenericSkill(1973, spec.meta, multistep(spec.action))
}
