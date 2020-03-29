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

// skill id: 1352
/** 
Attacks an enemy to make the Attack Bar to 0 with a 70% chance and stuns the target for 1 turn. The damage of this skill increases accordingly to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3 + attacker.def * 3,
                ),
                debuff(roll, "stun", 1, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 30,
            cooldown: 3,
        },
    }
    return new GenericSkill(1352, spec.meta, multistep(spec.action))
}
