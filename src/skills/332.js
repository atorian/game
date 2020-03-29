// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 332
/** 
Unleashes a relentless attack with arrows on random enemies (4 hits total) and increases the ally’s Attack Bar by 25% after the attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(332, spec.meta, multistep(spec.action))
}
