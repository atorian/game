// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1051
/** 
Attacks all enemies with a spell that summons the power of light to increase the enemy's chances of landing a Glancing Hit for 2 turns with a 75% chance and to provoke them for 1 turn with a 75% chance. The damage of this skill is proportionate to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                debuff(roll, "glancing", 2, 75),
                debuff(roll, "provoke", 1, 75),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 4,
        },
    }
    return new GenericSkill(1051, spec.meta, multistep(spec.action))
}
