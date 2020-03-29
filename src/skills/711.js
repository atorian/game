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

// skill id: 711
/** 
Throws a sharp card to attack and disturbs the enemy's HP recovery for 2 turns with a 70% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.6),
                debuff(roll, "heal_block", 2, 75),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(711, spec.meta, multistep(spec.action))
}
