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

// skill id: 1258
/** 
Assaults an enemy and disturbs its recovery for 2 turns. Assaults another enemy with 30% increased damage if this attack kills the first target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.7),
                debuff(roll, "heal_block", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1258, spec.meta, multistep(spec.action))
}
