import GameComponent from "./GameComponent";


export default class RenderComponent extends GameComponent {
    constructor(sprites=[], componentType="renderComponent") {
        super(componentType, "renderComponent");

        this.sprites = sprites;
        this.physicsSibling = null;

        if (this.sprites instanceof Array) {
            for (const sprite of this.sprites) {
                sprite.interactive = true;
            }
        } else {
            this.sprites.interactive = true;
        }
    }

    linkSibling(component) {
        if (component.superType === "physicsComponent") {
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

        return false;
    }

    // TODO Something about making proper functions to interact with gameCore.
    addComponent(gameCore) {
        if (this.sprites instanceof Array) {
            for (const sprite of this.sprites) {
                gameCore.addSprite(sprite);
            }
        } else {
            gameCore.addSprite(this.sprites);
        }
    }

    removeComponent(gameCore) {
        if (this.sprites instanceof Array) {
            for (const sprite of this.sprites) {
                gameCore.removeSprite(sprite);
            }
        } else {
            gameCore.removeSprite(this.sprites);
        }
    }

    addEventListeners(event, callback) {
        if (this.sprites instanceof Array) {
            for (const sprite of this.sprites) {
                sprite.on(event, callback);
            }
        } else {
            this.sprites.on(event, callback);
        }
    }
}