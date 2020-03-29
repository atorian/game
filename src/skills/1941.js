// @flow
import type { Ability } from "../index"
import { step, targetAlly, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1941
/** 
Attacks and stuns the enemy for 1 turn with a 15% chance. Recovers the HP of an ally, including yourself, with the lowest HP by 10% when you attack during your turn. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Ally with lowest HP
        action: [step(targetAlly, debuff(roll, "stun", 1, 15))],
        meta: {
            dmg: 30,
            effect: 15,
            cooldown: 0,
        },
    }
    return new GenericSkill(1941, spec.meta, multistep(spec.action))
}
