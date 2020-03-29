// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    debuff,
    buff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2414
/** 
The rider increases the Attack Speed of all allies for 2 turns, and the beast attacks all enemies. Weakens the enemy's Defense for 2 turns if the enemy's Defense is lower than your Attack Power, and sets the enemy's Attack Bar to 0 if the enemy's Attack Speed is slower than yours. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If ATK > enemy DEF
        // fixme: If your speed > enemy speed
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                debuff(roll, "def_break", 2, 100),
                buff((self, target) => target.buf("spd", 2)),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(2414, spec.meta, multistep(spec.action))
}
