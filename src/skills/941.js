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

// skill id: 941
/** 
Attacks without waking up the enemy that's under Sleep. Attacks all enemies and disturbs the HP recovery for 2 turns. If the enemy is under Sleep, destroys the enemy's MAX HP by 50% of the damage dealt. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If enemy is asleep
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                debuff(roll, "heal_block", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(941, spec.meta, multistep(spec.action))
}
