import Nemezis from "./nemezis";

export default class BattleMechanics {
    // pass mechanics dependencies
    constructor() {
        this.mechanics = [
            new Nemezis(/*policy*/),
        ];
    }
    subscribe(battle) {
        this.mechanics.map(
            m => m.subscribe(battle)
        );
    }
}
