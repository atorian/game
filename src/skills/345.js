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

// skill id: 345
/** 
Attacks an enemy target, decreasing its Attack Power and Attack Speed for 2 turns with an 80% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.4),
                debuff(roll, "atk_break", 2, 80),
                debuff(roll, "slow", 2, 80),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(345, spec.meta, multistep(spec.action))
}
