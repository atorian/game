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

// skill id: 796
/** 
Attacks the enemy target 3 times to remove the beneficial effect with the 1st attack. Decreases the Defense for 2 turns, and increases the skill cooldown by 2 turns with a 50% chance with each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.8),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "heal_block", 2, 50),
                debuff(roll, "silence", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.8),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "heal_block", 2, 50),
                debuff(roll, "silence", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.8),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "heal_block", 2, 50),
                debuff(roll, "silence", 2, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(796, spec.meta, multistep(spec.action))
}
