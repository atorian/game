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

// skill id: 267
/** 
Fires two magical arrows, with each hit having a 40% chance to freeze the enemy for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "freeze", 1, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "freeze", 1, 40),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 10,
            cooldown: 2,
        },
    }
    return new GenericSkill(267, spec.meta, multistep(spec.action))
}
