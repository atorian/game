// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1432
/** 
Attacks the enemy, decreases the target's Attack Bar by 50% with a 70% chance, and decreases the target's Attack Speed for 2 turns with a 70% chance. This attack will deal more damage according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2 + attacker.def * 3.2,
                ),
                debuff(roll, "slow", 2, 70),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 30,
            cooldown: 3,
        },
    }
    return new GenericSkill(1432, spec.meta, multistep(spec.action))
}
