// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2310
/** 
Inflicts damage on all enemies in proportion to your Defense and provokes them for 1 turn with an 80% chance each. Afterwards, you will be turned into a statue until the next turn starts. While you are a statue, you won't be able to move. But you will gain immunity against inability effects, receive 30% less damage and recover your HP by 10% until the statue state is gone. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.def * 3.6),
                debuff(roll, "provoke", 1, 80),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(2310, spec.meta, multistep(spec.action))
}
