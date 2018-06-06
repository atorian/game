import Nemezis from "./nemezis";
import AutoAction from "./auto-action";
import Guard from "./guard";

export default class BattleMechanics {
    // pass mechanics dependencies
    constructor() {
        this.mechanics = [
            new Nemezis(/*policy*/),
            new AutoAction(/*policy*/),
            new Guard(/*policy*/),
        ];
    }
    subscribe(battle) {
        this.mechanics.map(
            m => m.subscribe(battle)
        );
    }
}
