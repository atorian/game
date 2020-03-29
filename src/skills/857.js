// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 857
/** 
Inflicts damage with a sharp attack and inflicts Continuous Damage for 1 turn. Increases the attack bar by 100% when used with full HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 6.6),
                debuff(roll, "dot", 1, 100),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(857, spec.meta, multistep(spec.action))
}
