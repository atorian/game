// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 375
/** 
Attacks the enemy 3 times with a swift strike to disturb the enemy's HP recovery for 2 turns with a 75% chance and recovers the HP of all allies by 25% of the inflicted damage. Gets drunk and attacks a random enemy with [Rolling Punch] with a 50% chance afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "heal_block", 2, 75),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(375, spec.meta, multistep(spec.action))
}
