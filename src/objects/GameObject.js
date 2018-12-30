import PhysicsComponent from '../components/PhysicsComponent'
import RenderComponent from "../components/RenderComponent";
import mapRenderComponent from "../components/renderComponents/mapRenderComponent";
import React from "react";
import CityMenuComponent from "../components/menuComponents/CityMenuComponent";
import ProductionComponent from "../components/ProductionComponent";


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
    constructor(textureObject) {
        this.textureObject = textureObject;
    }

    createNewCity(gameCore, location, details) {
        const city = new GameObject(
            "city",
            gameCore,
            details
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

    createNewMap(gameCore) {
        const map = new GameObject(
            "gameMap",
            gameCore
        );

        map.addComponentsToObject({
            renderComponent: new mapRenderComponent(gameCore, this.textureObject, false)
        }, gameCore);

        return map;
    }

    createMap(gameCore, mapTerrain) {
        const map = new GameObject(
            "gameMap",
            gameCore
        );

        map.addComponentsToObject({
            renderComponent: new mapRenderComponent(gameCore, map, this.textureObject, mapTerrain)
        }, gameCore);

        return map;
    }
}
