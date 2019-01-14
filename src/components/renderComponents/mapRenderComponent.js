import GameComponent from "../GameComponent";
import RenderComponent from "../RenderComponent";
const PIXI = require("pixi.js");


export default class MapRenderComponent extends RenderComponent{
    static terrainKeys = {
        0: "ocean",
        1: "land",
    };

    static defaultSize = {
        x: 50,
        y: 50
    };

    static restore(
        gameCore,
        gameObject,
        component,
        textures
    ) {
        return new MapRenderComponent(gameCore, gameObject, textures, component.mapTerrain)
    }

    constructor(gameCore, gameObject, textures, mapTerrain=false, startingCoords={x:0, y:0}) {
        const sprites = [];

        if (!mapTerrain) {
            mapTerrain = MapRenderComponent.generateTerrain();
        }

        for (const x in mapTerrain) {
            for (const y in mapTerrain[x]) {
                const terrain = mapTerrain[y][x];
                const sprite = new PIXI.Sprite(textures[MapRenderComponent.terrainKeys[terrain]]);
                sprite.interactive = true;
                sprite.x = x * textures.metadata.tileSize + startingCoords.x;
                sprite.y = y * textures.metadata.tileSize + startingCoords.y;
                sprites.push(sprite);
            }
        }

        super(gameCore, gameObject, sprites, "mapRenderComponent");

        this.mapTextures = textures;
        this.mapTerrain = mapTerrain;
    }

    toJSON(key) {
        const that = super.toJSON(key);

        that.mapTextures = "[mapTextures]";
        return that;
    }

    linkSibling(component) {
        // blank to override parent
    }

    update(gameCore, lag) {
        return false;
    }


    static generateTerrain(
        xSize=MapRenderComponent.defaultSize.x,
        ySize=MapRenderComponent.defaultSize.y
    ) {
        const mapTerrain = [];

        for (let x=0; x < xSize; x++) {
            mapTerrain.push([]);
            for (let y=0; y < ySize; y++) {
                if (
                    x === 0 ||
                    y === 0 ||
                    x === xSize - 1 ||
                    y === ySize - 1
                ) {
                    mapTerrain[x].push(0)
                } else {
                    // Random number, either 1 or 0
                    mapTerrain[x].push(Math.floor(Math.random() * 2))
                }
            }
        }

        return mapTerrain;
    }
}