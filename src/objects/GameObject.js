import PhysicsComponent from '../components/PhysicsComponent'
import RenderComponent from "../components/RenderComponent";
import mapRenderComponent from "../components/renderComponents/mapRenderComponent";
import React from "react";
import CityMenuComponent from "../components/menuComponents/CityMenuComponent";
import InformationComponent from "../components/InformationComponent";


class GameObject {
    constructor(objecType, gameCore, components, details={}) {
        // Get components
        this.objectType = objecType;

        this.components = {};

        for (const component of Object.keys(components)) {
            this.addComponent(components[component], gameCore)
        }

        this.details = details;
    }

    addComponent(component, gameCore) {
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
        return new GameObject(
            "city",
            gameCore,
            {
                physicsComponent: new PhysicsComponent(gameCore, location),
                renderComponent: new RenderComponent(gameCore, new PIXI.Sprite(this.textureObject["town"])),
                menuComponent: new CityMenuComponent(gameCore),
                informationComponent: new InformationComponent(gameCore, details)
            }
        )
    }

    createNewMerchant(gameCore, location) {
        return new GameObject(
            "merchant",
            gameCore,
            {
                physicsComponent: new PhysicsComponent(gameCore, location),
                renderComponent: new RenderComponent(gameCore, new PIXI.Sprite(this.textureObject['merchant']))
            }
        )
    }

    createNewMap(gameCore) {
        return new GameObject(
            "gameMap",
            gameCore,
            {
                renderComponent: new mapRenderComponent(gameCore, this.textureObject, false)
            }
        )
    }

    createMap(gameCore, mapTerrain) {
        return new GameObject(
            "gameMap",
            gameCore,
            {
                renderComponent: new mapRenderComponent(gameCore, this.textureObject, mapTerrain)
            }
        )
    }
}
