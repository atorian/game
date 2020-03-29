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

// skill id: 1150
/** 
Summons a doll knight and attacks all enemies. Stuns them for 1 turn and decreases their Attack Speed for 2 turns with a 50% chance each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3.4),
                debuff(roll, "stun", 1, 100),
                debuff(roll, "slow", 2, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(1150, spec.meta, multistep(spec.action))
}
