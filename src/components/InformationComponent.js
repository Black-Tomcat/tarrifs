import GameComponent from "./GameComponent";


export default class InformationComponent extends GameComponent{
    constructor(gameCore, gameObject, details, componentType = "informationComponent") {
        super(gameCore, gameObject, componentType, "informationComponent");
        this.details = details;
    }

    update() {
        return false;
    }
}