import React from 'react';
import ReactDOM from "react-dom";
import jsonStorage from 'electron-json-storage';
const PIXI = require("pixi.js");
import path from "path";

import spritesheet from '../data/assets/spritesheet.png'
import spritesheetJSON from '../data/assets/spritesheet.json';
import GameObjectFactory from "../objects/GameObject";
import {getPixiApp, RenderCore} from "./RenderCore";
import MenuCore from "./MenuCore";
import Logger from "../utils/Logger";

const logger = Logger.getLogger();

export default class GameCore {
    static UPDATE_LENGTH = {
        // for each tick, how many ms will it take
        SLOW: 5000,
        NORMAL: 2000,
        FAST: 1000
    };

    // TODO move this to config area in order to make it fully modular.
    static gameComponentTypes = [
        "physicsComponents",
        "informationComponents"
    ];

    static renderComponentTypes = [
        "renderComponents",
        "menuComponents",
    ];

    static gameObjectTypes = [
        "citys",
        "merchants"
    ];

    static createConfig(options) {
        // TODO make this better.
        const config = {
            debug: false,
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

    constructor(options={}) {
        this.speed = GameCore.UPDATE_LENGTH.NORMAL;
        this.previous = null;
        this.lag = 0;

        this.components = {
            inactive: []
        };

        this.gameObjects = {
            unnamed: []
        };

        for (const componentName of [
            ...GameCore.gameComponentTypes,
            ...GameCore.renderComponentTypes
        ]) {
            this.components[componentName] = []
        }

        for (const objectName of GameCore.gameObjectTypes) {
            this.gameObjects[objectName] = [];
        }

        this.renderCore = new RenderCore();
        this.menuCore = new MenuCore();

        this.objectFactory = null;

        this.config = GameCore.createConfig(options)
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
            this.renderCore.loadGameGraphics().then((objectFactory) => {this.objectFactory = objectFactory})
        ]).then(() => {
            // Load in dummy game
            if (this.config.debug) {
                this.__loadGameSave("debug").then(() => {
                    startGameLoop();
                });
            } else {
                this.createNewGame();
                startGameLoop();
            }
            // Start timer and then start loop
        })
    }

    __loadGameConfig() {
        return new Promise((resolve, reject) => {
            // The path has to be set from the working directory.
            jsonStorage.setDataPath(path.resolve("./src/data/config"));

            jsonStorage.has("configfile", (err, hasKey) => {
                if (err) {
                    reject(err);
                }

                if (hasKey) {
                    // what to do if there is a file
                    resolve()
                }

                reject("There was no config file");
            })
        })
    }

    __loadGameSave(saveName) {
        return new Promise((resolve, reject) => {
            // The path has to be set from the working directory.
            jsonStorage.setDataPath(path.resolve("./src/data/saves"));

            jsonStorage.has(saveName, (err, hasKey) => {
                if (err) {
                    reject(err);
                }

                if (hasKey) {
                    jsonStorage.get(saveName, (err, data) => {
                        if (err) reject(err);

                        this.createNewGame(data.mapTerrain, data.cities);

                        resolve();
                    });
                } else {
                    // Must be under the 'else' clause due to jsonStorage.get() being async.
                    reject("There was no save under the name of '" + saveName + "'.");
                }
            })
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
        this.__updateComponents(GameCore.gameComponentTypes, delta)
    }

    __renderGraphics(lag) {
        this.__updateComponents(GameCore.renderComponentTypes, lag);

        this.menuCore.update()
    }

    createNewGame(
        mapTerrain=false,
        cities=[]
    ) {
        this.addNewGameObject(this.objectFactory.createMap(this, mapTerrain));
        // TODO patch hack
        for (const city of cities) {
            this.addNewGameObject(this.objectFactory.createNewCity(this, city.pos, city.details))
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