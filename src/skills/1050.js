// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 1050
/** 
Attacks all enemies with a spell that summons the power of wind. This attack has a 50% chance to decrease the target's Defense for 2 turns. The damage of this skill is proportionate to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy)],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 4,
        },
    }
    return new GenericSkill(1050, spec.meta, multistep(spec.action))
}
