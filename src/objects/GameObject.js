import PhysicsComponent from '../components/PhysicsComponent'
import RenderComponent from "../components/RenderComponent";
import mapRenderComponent from "../components/renderComponents/mapRenderComponent";
import MenuComponent from "../components/MenuComponent";


class GameObject {
    constructor(gameCore, components) {
        // Get components
        this.components = {};

        for (const component of Object.keys(components)) {
            this.addComponent(components[component])
        }
    }

    addComponent(component) {
        const componentName = component.toString().split("::")[1];

        for (const objectComponent of Object.keys(this.components)) {
            // Link both to incoming component and all the pre existing components.
            this.components[objectComponent].linkSibling(component);
            component.linkSibling(this.components[objectComponent]);
        }

        this.components[componentName] = component;
    }

    toString() {
        return "GameObject"
    }
}

export default class GameObjectFactory {
    constructor(textureObject) {
        this.textureObject = textureObject
    }

    createNewCity(gameCore, location) {
        return new GameObject(
            gameCore,
            {
                physicsComponent: new PhysicsComponent(location),
                renderComponent: new RenderComponent(new PIXI.Sprite(this.textureObject["town"])),
                menuComponent: new MenuComponent()
            }
        )
    }

    createNewMap(gameCore) {
        return new GameObject(
            gameCore,
            {
                renderComponent: new mapRenderComponent(gameCore, this.textureObject, false)
            }
        )
    }

    createMap(gameCore, mapTerrain) {
        return new GameObject(
            gameCore,
            {
                renderComponent: new mapRenderComponent(gameCore, this.textureObject, mapTerrain)
            }
        )
    }
}
