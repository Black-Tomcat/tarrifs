import GameComponent from "./GameComponent";


export default class PhysicsComponent extends GameComponent{
    constructor(pos) {
        super("physicsComponent", "physicsComponent");
        this.pos = {
            x: pos.x,
            y: pos.y
        }
    }

    linkSibling(components) {

    }

    update(gameCore, delta) {
        throw new Error("The 'update' method was not implemented.")
    }

    addComponent(gameCore) {

    }

    removeComponent(gameCore) {

    }
}