// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1633
/** 
Rolls 2 dice to attack all enemies and randomly grants Unrecoverable, Decrease DEF, Increased chances of landing a Glancing Hit Effects for 2 turns. More effects will be granted as the sum of the numbers increases. Instantly gains another turn if you get the same number. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "heal_block", 2, null),
                debuff(roll, "def_break", 2, null),
                debuff(roll, "glancing", 2, null),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1633, spec.meta, multistep(spec.action))
}
