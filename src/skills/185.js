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

// skill id: 185
/** 
Charges towards the enemy, freezes the target for 1 turn and weakens the target's defense for 1 turn. This attack will deal more damage according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.2 + attacker.def * 4,
                ),
                debuff(roll, "freeze", 1, 100),
                debuff(roll, "def_break", 1, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(185, spec.meta, multistep(spec.action))
}
