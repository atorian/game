// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1415
/** 
Attacks an enemy, stunning it for 1 turn with an 80% chance. If the target is stunned by your attack, you instantly gain another turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If Stun applies
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.2),
                debuff(roll, "stun", 1, 80),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 15,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(1415, spec.meta, multistep(spec.action))
}
