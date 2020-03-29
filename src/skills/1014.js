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

// skill id: 1014
/** 
Attacks and weakens the enemy's Attack Power and decreases the enemy's Attack Speed for 2 turns with a 75% chance. The target won't be granted with beneficial effects for 2 turns with a 75% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6.7),
                debuff(roll, "atk_break", 2, 75),
                debuff(roll, "slow", 2, 75),
                debuff(roll, "blockBuff", 2, 75),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1014, spec.meta, multistep(spec.action))
}
