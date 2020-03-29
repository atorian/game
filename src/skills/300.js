// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 300
/** 
Throws 3 strong uppercuts at an enemy. Each attack has a 15% chance to stun the enemy for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 30,
            cooldown: 4,
        },
    }
    return new GenericSkill(300, spec.meta, multistep(spec.action))
}
