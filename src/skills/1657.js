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

// skill id: 1657
/** 
Attacks the enemy 2 times to decrease the Defense for 2 turns with a 30% chance each and disturbs the HP recovery. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "def_break", 2, 30),
                debuff(roll, "heal_block", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "def_break", 2, 30),
                debuff(roll, "heal_block", 1, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1657, spec.meta, multistep(spec.action))
}
