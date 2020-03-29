// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 827
/** 
Blows up a ray of light to inflict damage 2 times to all enemies. Each attack has a 50% chance to increase the enemy's chances of landing a Glancing Hit for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.3),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(827, spec.meta, multistep(spec.action))
}
