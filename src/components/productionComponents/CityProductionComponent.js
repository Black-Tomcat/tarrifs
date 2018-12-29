import GameComponent from "../GameComponent";
import ProductionComponent from "../ProductionComponent";


export default class CityProductionComponent extends ProductionComponent{
    constructor(gameCore,  gameObject) {
        super(gameCore, gameObject, "cityProductionComponent", "productionComponent");
    }

    update(gameEngine, delta) {
        return super.update(gameEngine, delta);
    }
}