// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 2093
/** 
Attacks the enemies in the order of low HP ratio to high HP ratio by the number of Knowledge you have, and the damage increases as you attack. If you have 5 Knowledge, destroys the enemy's MAX HP by 50% of the damage dealt. This skill can be used when you have at least 1 Knowledge, and all Knowledge will be consumed once you use the skill. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 72
        // fixme: If used at 5 Knowledge
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2093, spec.meta, multistep(spec.action))
}
