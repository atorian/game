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

// skill id: 561
/** 
Attacks with a spinning punch and stuns the enemy for 1 turn with a 30% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                debuff(roll, "stun", 1, 30),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(561, spec.meta, multistep(spec.action))
}
