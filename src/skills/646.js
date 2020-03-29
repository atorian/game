// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 646
/** 
Inflicts great damage by attacking the enemy 4 times and decreases the Defense for 2 turns with a 25% chance for each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(646, spec.meta, multistep(spec.action))
}
