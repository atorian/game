// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1198
/** 
Attacks the enemy with a powerful lightning. Inflicts half of the damage you inflicted on all other enemies. If you defeat an enemy with your first attack, the damage inflicted on other enemies will be increased by 30%. 
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
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1198, spec.meta, multistep(spec.action))
}
