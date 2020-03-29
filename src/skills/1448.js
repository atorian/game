// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1448
/** 
Removes all beneficial effects granted on the enemy and weakens the enemy's Defense for 1 turn if you successfully remove the beneficial effects. Decreases the HP of yourself and the enemy target by 30% each with a flame and decreases the HP by 15% each if it's a Boss. Inflicts great damage to the target and creates a shield that's 50% of the inflicted damage for 3 turns afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Shield scales with ATK or Damage for skill: 1448
        // fixme: If buffs removed
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 8.6),
                debuff(roll, "def_break", 1, null),
                strip(roll, 10, 100),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1448, spec.meta, multistep(spec.action))
}
