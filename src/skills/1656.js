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

// skill id: 1656
/** 
Attacks the enemy 2 times to disturb the HP recovery for 2 turns and stuns the enemy for 1 turn with a 30% chance each.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "heal_block", 2, 30),
                debuff(roll, "stun", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
                debuff(roll, "heal_block", 2, 30),
                debuff(roll, "stun", 1, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1656, spec.meta, multistep(spec.action))
}
