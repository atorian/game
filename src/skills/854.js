// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 854
/** 
Attacks with a magic card and weakens the enemy's Attack Power and Defense for 2 turns with an 80% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6),
                debuff(roll, "def_break", 2, 80),
                debuff(roll, "atk_break", 2, 80),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(854, spec.meta, multistep(spec.action))
}
