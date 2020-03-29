// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithoutDmgReduction,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 930
/** 
Attacks with a secretly hidden blade to inflict damage that ignores all beneficial effects that reduce the inflicted damage. The damage also increases as your HP status decreases.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker =>
                        attacker.atk * 1 * (attacker.curHp * -0.6 + 2.8),
                ),
            ),
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker =>
                        attacker.atk * 1 * (attacker.curHp * -0.6 + 2.8),
                ),
            ),
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker =>
                        attacker.atk * 1 * (attacker.curHp * -0.6 + 2.8),
                ),
            ),
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker =>
                        attacker.atk * 1 * (attacker.curHp * -0.6 + 2.8),
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(930, spec.meta, multistep(spec.action))
}
