import React from 'react';
import ReactDOM from "react-dom";
import jsonStorage from 'electron-json-storage';
const PIXI = require("pixi.js");
import path from "path";
import waterfall from 'async/waterfall';

import spritesheet from '../data/assets/spritesheet.png'
import spritesheetJSON from '../data/assets/spritesheet.json';
import GameObjectFactory from "../objects/GameObject";
import {getPixiApp, RenderCore} from "./RenderCore";
import MenuCore from "./MenuCore";
import Logger from "../utils/Logger";
import MapRenderComponent from "../components/renderComponents/mapRenderComponent";


const logger = Logger.getLogger();

export default class GameCore {
    static UPDATE_LENGTH = {
        // for each tick, how many ms will it take
        SLOW: 5000,
        NORMAL: 2000,
        FAST: 1000
    };

    static createConfig(options) {
        // TODO make this better.
        const config = {
            // Default config
            debug: false,

            // Loaded in Config
            ...options
        };

        if (config.debug) {
            config.debug = {
                frames: 0,
                frames_time: 0
            }
        }

        return config;
    }

    toJSON(key) {
        if (key) {
            return "[GameCore]"
        }

        const gameCore = Object.assign({}, this);
        gameCore.renderCore = "[RenderCore]";
        gameCore.menuCore = "[MenuCore]";
        gameCore.objectFactory = "[objectFactory]";

        gameCore.components = "[components]";
        return gameCore;
    }

    constructor() {
        this.speed = GameCore.UPDATE_LENGTH.NORMAL;
        this.previous = null;
        this.lag = 0;

        this.gameObjects = null;
        this.components = null;

        this.renderCore = new RenderCore();
        this.menuCore = new MenuCore();

        this.objectFactory = null;

        this.config = null;
    }

    __setupGameObjects() {
        this.gameObjects = {
            unnamed: []
        };
        for (const objectName of this.config.gameObjectTypes) {
            this.gameObjects[objectName] = [];
        }

        this.components = {
            inactive: []
        };
        for (const componentName of [
            ...this.config.gameComponentTypes,
            ...this.config.renderComponentTypes
        ]) {
            this.components[componentName] = []
        }
    }

    startGame() {
        const startGameLoop = () => {
            if (this.config.debug) {
                setInterval(() => {
                    logger.debug("frames: " + this.config.debug.frames);
                    this.config.debug.frames = 0;
                    logger.debug("GameCore: ", this);
                }, 1000);
            }

            this.previous = new Date().getTime();
            this.gameLoop();
        };

        Promise.all([
            this.__loadGameConfig(),
            this.__loadGameData(),
            this.renderCore.loadGameGraphics()
        ]).then((results) => {
            const [_, gameData, textureObject] = results;
            this.objectFactory = new GameObjectFactory(textureObject, gameData);

            if (this.config.debug) {
                this.__loadGameSave("debug").then(() => {
                    startGameLoop();
                }).catch(() => {
                    this.createNewGame();
                    startGameLoop();
                });
            } else {
                this.createNewGame();
                startGameLoop();
            }
        })
    }

    __loadGameConfig() {
        return new Promise((resolve, reject) => {
            jsonStorage.has("config", {dataPath: "./src/data/config"}, (err, hasKey) => {
                if (err) {
                    reject(err);
                }

                if (hasKey) {
                    jsonStorage.get("config", {dataPath: "./src/data/config"}, (err, data) => {
                        if (err) reject(err);

                        this.config = GameCore.createConfig(data);
                        this.__setupGameObjects();
                        resolve()
                    });
                } else {
                    reject("There was no config file");
                }
            })
        })
    }

    __loadGameData() {
        return new Promise((resolve, reject) => {
            jsonStorage.getMany(
                ["recipes"],
                {dataPath: "./src/data/game"},
                (err, data) => {
                    if (err) reject(err);

                    for (const dataPoint in data) {
                        if (data[dataPoint] === {}) {
                            reject("The data point '" + dataPoint + "' was not present.")
                        }
                    }

                    resolve(data);
                }
            );
        })
    }

    __loadGameSave(saveName) {
        return new Promise((resolve, reject) => {
            jsonStorage.setDataPath(path.resolve("./src/data/saves"));

            jsonStorage.has(saveName, (err, hasKey) => {
                if (err) {
                    reject(err);
                }

                if (hasKey) {
                    jsonStorage.get(saveName, (err, data) => {
                        if (err) reject(err);

                        this.__restoreGameState(data);

                        resolve();
                    });
                } else {
                    reject("There was no save under the name of '" + saveName + "'.");
                }
            })
        })
    }

    __restoreGameState(gameSave) {
        logger.important("HEY, GAME IS LOADING");
        this.__setupGameObjects();

        this.renderCore.cleanStage();

        // TODO Come up with a better way to load graphics so it doesn't have to be reloaded between saves?
        // Considering it might be useful to keep this functionality here if separate skins were going to be used from game to game.
            for (const gameObjects of Object.values(gameSave.gameObjects)) {
                for (const gameObject of gameObjects) {
                    this.addNewGameObject(this.objectFactory.restoreObject(this, gameObject))
                }
            }
    }

    __saveGameSave(saveName) {
        return new Promise((resolve, reject) => {
            jsonStorage.setDataPath(path.resolve("./src/data/saves"));

            jsonStorage.set(saveName, this, (err) => {
                if (err) reject(err);

                resolve();
            });
        })
    }

    gameLoop = () => {
        // The game loop. Exactly what it says it is.
        // Timing mechanism updates the game state once every 1/60th of a second
        // and in the meantime, renders the rest of the game as fast as possible.

        // Calculate lag (how much time has passed since the last game update.
        let current = new Date().getTime();
        let elapsed = current - this.previous;
        this.previous = current;
        this.lag += elapsed;

        // If lag is greater than the 1/60th of a second, update the game.
        // Continue to do this while the lag is higher than that.
        while (this.lag >= this.speed) {
            // Passes through the amount of ticks since the last elapsed.
            // Delta is passed as game ticks, not as milliseconds since last update.
            this.__updateGameState(Math.floor(this.lag/this.speed));
            this.lag %= this.speed;
        }

        // Render the graphics with an idea of how much time has passed.
        // Passing in the lag helps better simulate the motion of projectiles and
        // other fast moving spritesheet on the game field.
        this.__renderGraphics(this.lag);

        if (this.config.debug) {
            this.config.debug.frames += 1;
        }

        // recall the game loop, and free up assets for Electron/PIXI
        requestAnimationFrame(this.gameLoop) // TODO find appropriate numbers.
    };

    __updateComponents(nameset, delta) {
        for (const componentName of nameset) {
            let componentList = this.components[componentName];

            for (const component of componentList) {
                if (!component.update(this, delta)) {
                    componentList.splice(componentList.indexOf(component), 1);
                    this.components.inactive.push(component)
                }
            }
        }
    }

    __updateGameState(delta) {
        this.__updateComponents(this.config.gameComponentTypes, delta)
    }

    __renderGraphics(lag) {
        this.__updateComponents(this.config.renderComponentTypes, lag);

        this.menuCore.update(this)
    }

    createNewGame(
        mapTerrain=false,
        cities="random"
    ) {
        if (!mapTerrain) {
            mapTerrain = MapRenderComponent.generateTerrain();
        }

        this.addNewGameObject(this.objectFactory.createMap(this, mapTerrain));
        // TODO patch hack
        let mapComponent;

        for (const object of this.gameObjects.unnamed) {
            if (object.objectType === "gameMap") {
                mapComponent = object.components.renderComponent;
            }
        }

        if (cities === "random") {
            cities = [];
            while (true) {
                const randX = Math.floor(Math.random() * MapRenderComponent.defaultSize.x);
                const randY = Math.floor(Math.random() * MapRenderComponent.defaultSize.y);

                if (mapTerrain[randX][randY] === 1) {
                    cities.push({
                        pos: {
                            x: randX * mapComponent.mapTextures.metadata.tileSize,
                            y: randY * mapComponent.mapTextures.metadata.tileSize
                        },
                        details: {
                            cityName: "randCity" + (cities.length + 1)
                        }
                    });
                    break;
                }
            }
        }

        for (const city of cities) {
            this.addNewGameObject(this.objectFactory.createNewCity(this, city.pos, city.details))
        }

        if (this.config.debug) {
            this.__saveGameSave("debug");
        }
    }

    addNewGameObject(object) {
        for (const componentName of Object.keys(object.components)) {
            const component = object.components[componentName];
            this.components[componentName + "s"].push(component);
        }

        for (const component of Object.values(object.components)) {
            component.addComponent(this);
        }

        try {
            this.gameObjects[object.objectType + "s"].push(object);
        } catch (e) {
            this.gameObjects["unnamed"].push(object);
        }
    }
}