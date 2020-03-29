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

// skill id: 205
/** 
Swings a giant sword to deal damage and decrease the target's Defense for 2 turns with a 40% chance. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.maxHp * 0.18,
                ),
                debuff(roll, "def_break", 2, 40),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 60,
            cooldown: 0,
        },
    }
    return new GenericSkill(205, spec.meta, multistep(spec.action))
}
