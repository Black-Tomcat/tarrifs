import GameComponent from "../GameComponent";
import ProductionComponent from "../ProductionComponent";


export default class CityProductionComponent extends ProductionComponent{
    constructor(gameCore) {
        super(gameCore, "cityProductionComponent", "productionComponent");
    }

    update(gameEngine, delta) {
        return super.update(gameEngine, delta);
    }
}