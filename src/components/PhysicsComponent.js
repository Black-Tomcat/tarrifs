import GameComponent from "./GameComponent";


export default class PhysicsComponent extends GameComponent{
    static restore(
        gameCore,
        gameObject,
        component
    ) {
        return new PhysicsComponent(gameCore, gameObject, component.pos);
    }
    constructor(gameCore, gameObject, pos) {
        super(gameCore, gameObject, "physicsComponent", "physicsComponent");
        this.pos = {
            x: pos.x,
            y: pos.y
        }
    }

    update(gameCore, delta) {
        // This returns false as this generic physics component is just to supply position
        // while in practice, this is rather useless, it allows for a neat thinking.
        return false;
    }
}