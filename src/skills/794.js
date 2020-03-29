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

// skill id: 794
/** 
Attacks an enemy, stunning the enemy for 1 turn and sets back all of the target's skills to MAX cooldown with an 80% chance each. If your HP is at 50% or lower, stuns the enemy for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Duplicate debuffs
        // fixme: If self HP < 50%
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 8),
                debuff(roll, "stun", 1, 80),
                debuff(roll, "stun", 1, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(794, spec.meta, multistep(spec.action))
}
