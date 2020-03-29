// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1951
/** 
Attacks all enemies with chakrams 2 times and stuns them for 1 turn with a 30% chance each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
                debuff(roll, "stun", 1, 30),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
                debuff(roll, "stun", 1, 30),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(1951, spec.meta, multistep(spec.action))
}
