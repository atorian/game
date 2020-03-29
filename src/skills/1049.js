// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1049
/** 
Attacks all enemies with a spell that summons the power of water. This attack has an 80% chance to decrease the target's Attack Speed for 2 turns. The damage of this skill is proportionate to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 30,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(1049, spec.meta, multistep(spec.action))
}
