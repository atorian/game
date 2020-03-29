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

// skill id: 253
/** 
Attacks the enemy 2 times and stuns the enemy for 1 turn with a 30% chance for each attack. This attack will deal more damage according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.5 + attacker.def * 1.5,
                ),
                debuff(roll, "stun", 1, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.5 + attacker.def * 1.5,
                ),
                debuff(roll, "stun", 1, 30),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 20,
            cooldown: 2,
        },
    }
    return new GenericSkill(253, spec.meta, multistep(spec.action))
}
