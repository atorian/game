// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1228
/** 
Attacks the enemies multiple times with flaming meteoroids with each attack having a 25% chance to stun the target for 1 turn. Your Attack Bar will be recovered by 25% for each enemy stunned by this attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 15,
            cooldown: 4,
        },
    }
    return new GenericSkill(1228, spec.meta, multistep(spec.action))
}
