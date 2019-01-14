import PhysicsComponent from '../components/PhysicsComponent'
import RenderComponent from "../components/RenderComponent";
import MapRenderComponent from "../components/renderComponents/mapRenderComponent";
import React from "react";
import CityMenuComponent from "../components/menuComponents/CityMenuComponent";
import ProductionComponent from "../components/ProductionComponent";
import Logger from "../utils/Logger";
import MenuComponent from "../components/MenuComponent";

const logger = Logger.getLogger();


class GameObject {
    constructor(objectType, gameCore, details={}) {
        this.objectType = objectType;

        this.components = {};

        this.details = details;
    }

    addComponentsToObject(components, gameCore) {
        for (const componentType of Object.keys(components)) {
            this.__addComponent(components[componentType], gameCore)
        }
    }

    __addComponent(component, gameCore) {
        for (const objectComponent of Object.keys(this.components)) {
            // Link both to incoming component and all the pre existing components.
            this.components[objectComponent].linkSibling(component, gameCore);
            component.linkSibling(this.components[objectComponent], gameCore);
        }

        this.components[component.superType] = component;
    }

    toString() {
        return "GameObject"
    }
}

export default class GameObjectFactory {
    static componentTypeMap = {
        "cityMenuComponent": CityMenuComponent,
        "mapRenderComponent": MapRenderComponent,
        "menuComponent": MenuComponent,
        "physicsComponent": PhysicsComponent,
        "productionComponent": ProductionComponent,
        "renderComponent": RenderComponent
    };

    constructor(textureObject, gameData) {
        this.textureObject = textureObject;

        for (const recipe of gameData.recipes) {
            ProductionComponent.recipes[recipe.itemType] = new ProductionComponent.Recipe(
                recipe.costs,
                recipe.itemType
            )
        }
    }

    restoreObject(gameCore, saveGameObject) {
        const gameObject = new GameObject(
            saveGameObject.objectType,
            gameCore,
            saveGameObject.details
        );

        const components = {};
        for (const component of Object.values(saveGameObject.components)) {
            const componentType = GameObjectFactory.componentTypeMap[component.componentType];
            components[component.superType] = componentType.restore(gameCore, gameObject, component, this.textureObject);
        }

        gameObject.addComponentsToObject(components, gameCore);

        return gameObject
    }

    createNewCity(
        gameCore,
        location,
        details,
        stockpile = {},

    ) {
        const city = new GameObject(
            "city",
            gameCore,
            details,
        );

        city.addComponentsToObject({
            physicsComponent: new PhysicsComponent(gameCore, city, location),
            renderComponent: new RenderComponent(gameCore, city, new PIXI.Sprite(this.textureObject["town"])),
            menuComponent: new CityMenuComponent(gameCore, city),
            productionComponent: new ProductionComponent(
                gameCore,
                city,
                {
                    wood: 100,
                    gold: 200,
                    iron: 50
                },
                []
            )
        }, gameCore);

        return city;
    }

    createNewMerchant(gameCore, location) {
        const merchant = new GameObject(
            "merchant",
            gameCore
        );

        merchant.addComponentsToObject({
            physicsComponent: new PhysicsComponent(gameCore, location),
            renderComponent: new RenderComponent(gameCore, new PIXI.Sprite(this.textureObject['merchant']))
        }, gameCore);

        return merchant
    }

    createMap(gameCore, mapTerrain) {
        const map = new GameObject(
            "gameMap",
            gameCore
        );

        map.addComponentsToObject({
            renderComponent: new MapRenderComponent(gameCore, map, this.textureObject, mapTerrain)
        }, gameCore);

        return map;
    }
}
