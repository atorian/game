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

// skill id: 1453
/** 
Attacks the enemy 3 times with each strike having a 30% chance to decrease the target's Defense for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "def_break", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "def_break", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "def_break", 2, 30),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1453, spec.meta, multistep(spec.action))
}
