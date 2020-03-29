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

// skill id: 1964
/** 
Attacks all enemies with a boomerang and stuns them for 1 turn with a 50% chance each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3.2),
                debuff(roll, "stun", 1, 50),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(1964, spec.meta, multistep(spec.action))
}
