// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1153
/** 
Attacks all enemies 3 times. Each attack decreases their Attack Bar by 30%, and has a 40% chance to increase the enemy's chances of landing a Glancing Hit for 2 turns. Afterwards, increases the Attack Bar of all allies by 20% additionally. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
                debuff(roll, "glancing", 2, 40),
                atbDecrease(roll, undefined),
            ),
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
                debuff(roll, "glancing", 2, 40),
                atbDecrease(roll, undefined),
            ),
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
                debuff(roll, "glancing", 2, 40),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(1153, spec.meta, multistep(spec.action))
}
