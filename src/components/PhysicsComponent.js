import GameComponent from "./GameComponent";


export default class PhysicsComponent extends GameComponent{
    constructor(pos) {
        super("physicsComponent", "physicsComponent");
        this.pos = {
            x: pos.x,
            y: pos.y
        }
    }

    update(gameCore, delta) {
        return true;
    }
}