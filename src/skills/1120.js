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

// skill id: 1120
/** 
Attacks all enemies and stuns them with a 30% chance. The damage is proportionate to my MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.2 + attacker.maxHp * 0.16,
                ),
                debuff(roll, "stun", 1, 30),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 30,
            cooldown: 3,
        },
    }
    return new GenericSkill(1120, spec.meta, multistep(spec.action))
}
