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

// skill id: 718
/** 
Summons a surprise box that inflicts damage and grants 1 random harmful effect among Stun, Glancing Hit Rate Increase, and Attack Speed Decrease to all enemies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "stun", 2, null),
                debuff(roll, "glancing", 2, null),
                debuff(roll, "slow", 2, null),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(718, spec.meta, multistep(spec.action))
}
