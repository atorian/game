// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1111
/** 
Attacks an enemy target 5 times to remove the beneficial effect with each attack and Stuns the enemy for 1 turn with a 30% chance. The chance of the enemy being stunned increases as the enemy's HP decreases after the attack. The stun is guaranteed if the enemy has 30% or less HP.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Stun chance increases as enemy HP decreases
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "stun", 1, 30),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "stun", 1, 30),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "stun", 1, 30),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "stun", 1, 30),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "stun", 1, 30),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1111, spec.meta, multistep(spec.action))
}
