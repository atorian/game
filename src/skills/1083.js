// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1083
/** 
Attacks all enemies with the power of darkness. This skill deals 100% increased Critical Damage on Critical Hits and the defeated enemy can't be revived. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.8),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1083, spec.meta, multistep(spec.action))
}
