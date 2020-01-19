
export default {
    navigate(path) {
        window.location = path;
    },
    fightBattle(battleId) {
        this.navigate(`/battle.html?id=${battleId}`);
    }
};
