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

// skill id: 1397
/** 
Attacks all enemies 2 times with each attack having a 50% chance to decrease the target's Attack Power and disturb their HP recovery for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                debuff(roll, "atk_break", 2, 50),
                debuff(roll, "heal_block", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                debuff(roll, "atk_break", 2, 50),
                debuff(roll, "heal_block", 2, 50),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 25,
            cooldown: 4,
        },
    }
    return new GenericSkill(1397, spec.meta, multistep(spec.action))
}
