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

// skill id: 1986
/** 
Attacks an enemy to decrease the Attack Bar by 50% and puts the target in Oblivion state for 3 turns. Passive skills aren't activated in Oblivion state. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.3),
                debuff(roll, "oblivious", 3, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1986, spec.meta, multistep(spec.action))
}
