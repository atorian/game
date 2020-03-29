// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 433
/** 
Decreases the enemy's Attack Speed with freezing chills for 3 turns and freezes the enemy for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6.1),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(433, spec.meta, multistep(spec.action))
}
