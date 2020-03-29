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

// skill id: 529
/** 
Attacks all enemies 3 times each, dealing damage proportionate to your Defense. Each attack has a 50% chance to reduce the target's Attack Power and block beneficial effects for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.7),
                debuff(roll, "atk_break", 2, 50),
                debuff(roll, "blockBuff", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.7),
                debuff(roll, "atk_break", 2, 50),
                debuff(roll, "blockBuff", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.7),
                debuff(roll, "atk_break", 2, 50),
                debuff(roll, "blockBuff", 2, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(529, spec.meta, multistep(spec.action))
}
