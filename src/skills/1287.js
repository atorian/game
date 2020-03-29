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

// skill id: 1287
/** 
Attacks the enemy with a thundering blow that shakes the ground and stuns the target for 1 turn with a 75% chance. The damage increases accordingly to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.1 + attacker.def * 4.4,
                ),
                debuff(roll, "stun", 1, 75),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 25,
            cooldown: 2,
        },
    }
    return new GenericSkill(1287, spec.meta, multistep(spec.action))
}
