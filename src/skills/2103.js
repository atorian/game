// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 2103
/** 
Strikes the [Hidden Aim] pose. Increases the chances of receiving a glancing hit by 50% and the damage dealing to an enemy by 200% if you're attacked while in this pose. The [Hidden Aim] pose disables after you attack on your turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2103, spec.meta, multistep(spec.action))
}
