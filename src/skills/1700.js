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

// skill id: 1700
/** 
Attacks the enemy and Freezes the target for 1 turn with a 25% chance. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.8 + attacker.maxHp * 0.12,
                ),
                debuff(roll, "freeze", 1, 25),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(1700, spec.meta, multistep(spec.action))
}
