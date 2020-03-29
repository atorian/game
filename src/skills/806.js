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

// skill id: 806
/** 
Attacks the enemy 3 times with a shimmering light. Each attack has a 10% chance to freeze the enemy for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "freeze", 1, 10),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "freeze", 1, 10),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "freeze", 1, 10),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(806, spec.meta, multistep(spec.action))
}
