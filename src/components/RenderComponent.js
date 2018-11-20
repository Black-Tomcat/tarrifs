import GameComponent from "./GameComponent";
const PIXI = require('pixi.js');

export default class RenderComponent extends GameComponent {
    constructor(sprites=[], componentType="renderComponent") {
        super(componentType, "renderComponent");

        this.sprites = sprites;
        this.physicsSibling = null;
    }

    linkSibling(component) {
        if (component.toString().split("::")[1] === "physicsComponent") {
            this.physicsSibling = component;
            if (!(this.sprites instanceof Array)) {
                this.sprites.x = this.physicsSibling.pos.x;
                this.sprites.y = this.physicsSibling.pos.y;
            }
        }
    }

    update(gameEngine, lag) {
        if (this.physicsSibling === null) {
            throw new Error("physicsSibling not defined.")
        }
    }

    addComponent(gameCore) {
        if (this.sprites instanceof Array) {
            gameCore.pixiApp.stage.addChild(...this.sprites);
        } else {
            gameCore.pixiApp.stage.addChild(this.sprites);
        }
    }

    removeComponent(gameCore) {
        if (this.sprites instanceof Array) {
            gameCore.pixiApp.stage.removeChild(...this.sprites);
        } else {
            gameCore.pixiApp.stage.removeChild(this.sprites);
        }
    }
}