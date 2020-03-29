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

// skill id: 210
/** 
Attacks an enemy with a humiliating strike, provoking the target with an 80% chance. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.maxHp * 0.26 + attacker.atk * 1.9,
                ),
                debuff(roll, "provoke", 1, 80),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 2,
        },
    }
    return new GenericSkill(210, spec.meta, multistep(spec.action))
}
