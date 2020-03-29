// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 634
/** 
Attacks all enemies, weakens their Defense and deals Continuous Damage for 2 turns. The damage of this attack is proportionate to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                debuff(roll, "def_break", 2, 100),
                debuff(roll, "dot", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(634, spec.meta, multistep(spec.action))
}
