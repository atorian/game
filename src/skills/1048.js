// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1048
/** 
Attacks all enemies with a spell that summons the power of fire and Silences them for 2 turns with a 75% chance. The damage of this skill is proportionate to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemies, debuff(roll, "silence", 2, 75))],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 4,
        },
    }
    return new GenericSkill(1048, spec.meta, multistep(spec.action))
}
