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

// skill id: 1025
/** 
Deals damage with flames of punishment and inflicts Continuous Damage for 3 turns. The initial damage increases according to Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.3 + attacker.def * 5,
                ),
                debuff(roll, "dot", 3, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1025, spec.meta, multistep(spec.action))
}
