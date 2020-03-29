// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 496
/** 
On the moment of death, inflicts 33% of your MAX HP as damage to the attacker and disturbs HP recovery for 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 10,
        },
    }
    return new GenericSkill(496, spec.meta, multistep(spec.action))
}
