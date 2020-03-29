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

// skill id: 1757
/** 
Attacks an enemy 3 times. Each attack has a 25% chance to decrease the target's Defense by 50% for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "def_break", 2, 25),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "def_break", 2, 25),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "def_break", 2, 25),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 15,
            cooldown: 3,
        },
    }
    return new GenericSkill(1757, spec.meta, multistep(spec.action))
}
