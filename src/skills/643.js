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

// skill id: 643
/** 
Attacks all enemies 2 times with waves of water. Each attack has a 30% chance to decrease the target's Attack Speed for 2 turns. If the target already suffers an Attack Speed reduction effect, this attack will stun them for 1 turn.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If already has Reduce SPD debuff
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "slow", 2, 30),
                debuff(roll, "stun", 1, null),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "slow", 2, 30),
                debuff(roll, "stun", 1, null),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(643, spec.meta, multistep(spec.action))
}
