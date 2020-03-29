// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithDefIgnore,
    debuff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1382
/** 
Strikes with every last bit of power left in the body. This attack will ignore the target's Defense, but you will be stunned for 1 turn after performing this attack. The damage of this attack increases according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.def * 1.6),
                debuff(roll, "stun", 1, 100),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.def * 1.6),
                debuff(roll, "stun", 1, 100),
            ),
            step(targetSelf, debuff(roll, "stun", 1, 100)),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1382, spec.meta, multistep(spec.action))
}
