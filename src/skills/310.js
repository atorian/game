// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 310
/** 
Attacks an enemy to disturb HP recovery for 2 turns. Leaves the Branding Effect for 2 turns if the target has higher MAX HP than that of yours. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If target MAX HP greater
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.5),
                debuff(roll, "heal_block", 2, 100),
                debuff(roll, "brand", 2, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(310, spec.meta, multistep(spec.action))
}
