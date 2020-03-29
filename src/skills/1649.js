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

// skill id: 1649
/** 
Attacks all enemies to put them to sleep for 1 turn and creates a shield that's equivalent to 30% of the damage on all allies for 2 turns. The damage of this skill increases accordingly to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Shield of ATK,MAX HP
        action: [
            step(
                targetAllies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.maxHp * 0.12,
                ),
                debuff(roll, "sleep", 1, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1649, spec.meta, multistep(spec.action))
}
