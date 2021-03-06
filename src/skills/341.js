// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 341
/** 
Deals damage to all enemies. This attack has a 50% chance to decrease the Attack Power and a 50% chance to decrease the Attack Speed for 2 turns each.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.2),
                debuff(roll, "atk_break", 2, 50),
                debuff(roll, "slow", 2, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(341, spec.meta, multistep(spec.action))
}
