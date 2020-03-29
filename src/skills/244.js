// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 244
/** 
Deals damage according to your MAX HP. This attack receives a 70% Critical Rate bonus, and stuns the enemy for 1 turn when this attack lands as a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy, debuff(roll, "stun", 1, null))],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(244, spec.meta, multistep(spec.action))
}
