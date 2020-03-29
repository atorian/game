// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    debuff,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 374
/** 
Attacks the enemy 3 times and decreases the Defense for 2 turns with a 75% chance and recovers the HP of all allies for 2 turns by 15% each. Gets drunk and attacks a random enemy with [Rolling Punch] with a 50% chance afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
                debuff(roll, "def_break", 2, 75),
                buff((self, target) => target.buf("hot", 2)),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(374, spec.meta, multistep(spec.action))
}
