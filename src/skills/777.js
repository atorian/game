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

// skill id: 777
/** 
Shoots 4 magic bullets that seek enemies with low HP ratio. The bullets have a 50% chance to decrease the target's Defense for 2 turns each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "heal_block", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "heal_block", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "heal_block", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "heal_block", 2, 50),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(777, spec.meta, multistep(spec.action))
}
