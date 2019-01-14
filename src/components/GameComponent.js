export default class GameComponent {
    /*
    * Lifecycle of a GameComponent
    *
    * '...' indicates called more than once
    *
    * constructor()
    * linkSibling(x), ...
    * __addComponent()
    * update(), ...
    *   return false if inactive from that point. Otherwise, return true.
    * removeComponent()
    * */

    constructor(gameCore, gameObject, componentType, superType, details={}) {
        this.gameObject = gameObject;
        this.componentType = componentType;
        this.superType = superType;
        this.details = details;
    }

    toJSON(key) {
        if (key) {
            const that = Object.assign({}, this);
            that.gameObject = "[gameObject]";

            return that;
        }

        return this;
    }

    linkSibling(component) {

    }

    update(gameCore, delta) {
        throw new Error("The 'update' method was not implemented.")
    }

    addComponent(gameCore) {

    }

    removeComponent(gameCore) {

    }

    toString() {
        /*
        * Format:
        * [0] => Name of the component. E.G., cityRenderComponent, merchantAIComponent
        * [1] => Name of the base component. E.G., physicsComponent, renderComponent
        */
        return [this.componentType, this.superType].join("::")
    }
}