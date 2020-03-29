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

// skill id: 2142
/** 
Attacks the enemy 3 times with a whirling storm of light. Stuns the enemy for 1 turn with a 60% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "stun", 1, 60),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "stun", 1, 60),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "stun", 1, 60),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 10,
            cooldown: 0,
        },
    }
    return new GenericSkill(2142, spec.meta, multistep(spec.action))
}
