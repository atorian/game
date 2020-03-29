// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 772
/** 
Attacks the enemy target 2 times and attacks all enemies with even more powerful attack on the 3rd attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(772, spec.meta, multistep(spec.action))
}
