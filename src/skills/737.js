// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 737
/** 
Attacks all enemies with a bright flash of light to decrease the Attack Bar by 50% and stuns the enemies for 1 turn with a 60% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3.9),
                debuff(roll, "stun", 1, 60),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 5,
        },
    }
    return new GenericSkill(737, spec.meta, multistep(spec.action))
}
