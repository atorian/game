// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 470
/** 
Charges towards the enemy with a spear to inflict continuous damage for 1 turn. Increases your Attack Power for 2 turns if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                debuff(roll, "dot", 1, 100),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("atk", 2)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(470, spec.meta, multistep(spec.action))
}
