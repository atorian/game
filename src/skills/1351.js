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

// skill id: 1351
/** 
Attacks all enemies with winds of sand, decreasing 30% of their Attack Bar and also their Attack Speed by 2 turns with a 50% chance. The damage of this skill increases accordingly to your Attack Speed.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 50)) / 50,
                ),
                debuff(roll, "slow", 2, 50),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(1351, spec.meta, multistep(spec.action))
}
