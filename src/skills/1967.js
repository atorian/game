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

// skill id: 1967
/** 
Attacks the enemy 3 times to decrease the Defense and Attack Power for 1 turn with a 50% chance each and disturbs the HP recovery. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                debuff(roll, "def_break", 1, 50),
                debuff(roll, "atk_break", 1, 50),
                debuff(roll, "heal_block", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                debuff(roll, "def_break", 1, 50),
                debuff(roll, "atk_break", 1, 50),
                debuff(roll, "heal_block", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                debuff(roll, "def_break", 1, 50),
                debuff(roll, "atk_break", 1, 50),
                debuff(roll, "heal_block", 1, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 2,
        },
    }
    return new GenericSkill(1967, spec.meta, multistep(spec.action))
}
