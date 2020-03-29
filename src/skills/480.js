// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithDefIgnore,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 480
/** 
Charges towards the enemy to attack 5 times, and either inflicts continuous damage for 1 turn with a 75% chance or ignores the enemy's Defense with a 25% chance with each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "dot", 1, 75),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "dot", 1, 75),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "dot", 1, 75),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "dot", 1, 75),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "dot", 1, 75),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(480, spec.meta, multistep(spec.action))
}
