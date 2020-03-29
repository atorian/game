// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 2311
/** 
Inflicts damage on the enemy in proportion to your Defense and destroys the target's HP by the amount of damage dealt. Afterwards, you will be turned into a statue until the next turn starts. While you are a statue, you won't be able to move. But you will gain immunity against inability effects, receive 30% less damage and recover your HP by 10% until the statue state is gone. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.35),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2311, spec.meta, multistep(spec.action))
}
