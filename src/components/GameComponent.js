export default class GameComponent {
    /*
    * Lifecycle of a GameComponent
    *
    * '...' indicates called more than once
    *
    * constructor()
    * linkSibling(x), ...
    * addComponent()
    * update(), ...
    *   return false if inactive from that point. Otherwise, return true.
    * removeComponent()
    * */

    constructor(componentType, superType) {
        this.componentType = componentType;
        this.superType = superType;
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