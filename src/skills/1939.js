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

// skill id: 1939
/** 
Attacks and stuns the enemy for 1 turn with a 15% chance. You'll gain immunity for 1 turn afterwards. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.3 + attacker.maxHp * 0.18,
                ),
                debuff(roll, "stun", 1, 85),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("immunity", 1)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 15,
            cooldown: 0,
        },
    }
    return new GenericSkill(1939, spec.meta, multistep(spec.action))
}
