// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 494
/** 
Inflicts significant damage with Judgment of Light and removes all beneficial effects from the target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.7),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(494, spec.meta, multistep(spec.action))
}
