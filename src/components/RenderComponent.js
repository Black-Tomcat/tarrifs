import GameComponent from "./GameComponent";


export default class RenderComponent extends GameComponent {
    static restore(
        gameCore,
        gameObject,
        component,
        textures,
        componentType = "renderComponent"
    ) {
        const sprites = [];
        for (const spriteTexture of component.sprites.split(", ")) {
            sprites.push(new PIXI.Sprite(textures[spriteTexture]));
        }
        return new RenderComponent(gameCore, gameObject, sprites, componentType)
    }

    constructor(gameCore, gameObject, sprites = [], componentType = "renderComponent") {
        super(gameCore, gameObject, componentType, "renderComponent");

        this.sprites = (sprites instanceof Array && sprites.length) === 1 ? sprites[0] : sprites;
        this.physicsSibling = null;

        if (this.sprites instanceof Array) {
            for (const sprite of this.sprites) {
                sprite.interactive = true;
            }
        } else {
            this.sprites.interactive = true;
        }
    }

    toJSON(key) {
        const that = super.toJSON(key);

        if (this.sprites instanceof Array) {
            for (const sprite of this.sprites) {
                const textureCache = sprite.texture.textureCacheIds;
                that.sprites += textureCache[textureCache.length - 1];
                that.sprites += ", ";
            }
        } else {
            const textureCache = this.sprites.texture.textureCacheIds;
            that.sprites = textureCache[textureCache.length - 1];
        }
        that.physicsSibling = "[physicsSibling]";
        return that
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
                gameCore.renderCore.addSprite(sprite);
            }
        } else {
            gameCore.renderCore.addSprite(this.sprites);
        }
    }

    removeComponent(gameCore) {
        if (this.sprites instanceof Array) {
            for (const sprite of this.sprites) {
                gameCore.renderCore.removeSprite(sprite);
            }
        } else {
            gameCore.renderCore.removeSprite(this.sprites);
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