// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1066
/** 
Attacks all enemies to inflict damage proportionate to your Attack Speed. Weakens their Attack Power for 2 turns and stuns them for 1 turn with a 75% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 185)) / 70,
                ),
                debuff(roll, "stun", 1, 75),
                debuff(roll, "atk_break", 2, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1066, spec.meta, multistep(spec.action))
}
