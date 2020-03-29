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

// skill id: 845
/** 
Attacks all enemies 3 times. Each attack has a 30% chance to stuns the enemy for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "stun", 1, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "stun", 1, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "stun", 1, 30),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(845, spec.meta, multistep(spec.action))
}
