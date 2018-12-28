import GameComponent from "../GameComponent";
import RenderComponent from "../RenderComponent";
const PIXI = require("pixi.js");


export default class mapRenderComponent extends RenderComponent{
    static terrainKeys = {
        0: "ocean",
        1: "land",
        2: "town"
    };

    static defaultSize = {
        x: 50,
        y: 50
    };

    constructor(gameCore, textures, mapTerrain=false, startingCoords={x:0, y:0}) {
        const sprites = [];

        if (!mapTerrain) {
            mapTerrain = mapRenderComponent.generateTerrain();
        }

        for (const x in mapTerrain) {
            for (const y in mapTerrain[x]) {
                const terrain = mapTerrain[y][x];
                const sprite = new PIXI.Sprite(textures[mapRenderComponent.terrainKeys[terrain]]);
                sprite.interactive = true;
                sprite.x = x * textures.metadata.tileSize + startingCoords.x;
                sprite.y = y * textures.metadata.tileSize + startingCoords.y;
                sprites.push(sprite);
            }
        }

        super(gameCore, sprites, "mapRenderComponent");

        this.mapTextures = textures;
    }

    linkSibling(component) {
        // blank to override parent
    }

    update(gameEngine, lag) {
        return false;
    }


    static generateTerrain(
        xSize=mapRenderComponent.defaultSize.x,
        ySize=mapRenderComponent.defaultSize.y
    ) {
        const mapTerrain = [];

        for (let x=0; x < xSize; x++) {
            mapTerrain.push([]);
            for (let y=0; y < ySize; y++) {
                // Random number, either 1 or 0
                mapTerrain[x].push(Math.floor(Math.random() * 2))
            }
        }

        return mapTerrain;
    }
}