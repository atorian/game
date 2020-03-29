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

// skill id: 670
/** 
Throws an axe and stuns the enemy for 1 turn with an 80% chance. Disturbs the enemy's HP recovery for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6),
                debuff(roll, "stun", 1, 80),
                debuff(roll, "heal_block", 2, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(670, spec.meta, multistep(spec.action))
}
