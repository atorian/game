// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 615
/** 
Gathers power for a strong, fast charge. The critical rate increases to 100% if the enemy's defense is weakened. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.6),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(615, spec.meta, multistep(spec.action))
}
