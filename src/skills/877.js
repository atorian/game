// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 877
/** 
Attacks an enemy target and decreases its Attack Power and Defense while preventing the target from receiving beneficial effects for 2 turns with a 75% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 8),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(877, spec.meta, multistep(spec.action))
}
