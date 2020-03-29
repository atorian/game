// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 559
/** 
Attacks consecutively with 2 arrows. Each attack has a 30% chance to ignore the enemy's Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
            ),
        ],
        meta: {
            dmg: 40,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(559, spec.meta, multistep(spec.action))
}
