// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 601
/** 
Curses an enemy, removing the beneficial effects on the enemy. Also, with an 80% chance, disturbs the enemy's HP recovery and prevents the enemy from receiving any beneficial effects for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.3),
                debuff(roll, "heal_block", 2, 80),
                debuff(roll, "blockBuff", 2, 80),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(601, spec.meta, multistep(spec.action))
}
