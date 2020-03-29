// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 671
/** 
Strikes the enemy with an axe. This attack will ignore all effects that resist death. When this attack is on cool down, your Attack Speed increases and you recover 10% HP every turn. 
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
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(671, spec.meta, multistep(spec.action))
}
