import GameComponent from "./GameComponent";


export default class InformationComponent extends GameComponent{
    constructor(gameCore, details, componentType = "informationComponent") {
        super(gameCore, componentType, "informationComponent");
        this.details = details;
    }

    update() {
        return false;
    }
}