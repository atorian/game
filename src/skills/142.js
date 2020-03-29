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

// skill id: 142
/** 
Attacks the enemy 3 consecutive times, and adds Continuous Damage, weakened Defense, and stun to each attack if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: First attack only
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "dot", 3, null),
                debuff(roll, "def_break", 1, null),
                debuff(roll, "stun", 1, null),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "dot", 3, null),
                debuff(roll, "def_break", 1, null),
                debuff(roll, "stun", 1, null),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.4),
                debuff(roll, "dot", 3, null),
                debuff(roll, "def_break", 1, null),
                debuff(roll, "stun", 1, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(142, spec.meta, multistep(spec.action))
}
