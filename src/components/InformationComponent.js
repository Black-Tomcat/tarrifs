import GameComponent from "./GameComponent";


export default class InformationComponent extends GameComponent{
    constructor(details, componentType="informationComponent") {
        super(componentType, "informationComponent");
        this.details = details;
    }

    update() {

    }
}