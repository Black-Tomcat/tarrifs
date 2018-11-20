import React, { Component } from 'react';
import GameComponent from "./GameComponent";


export default class MenuComponent extends GameComponent {
    constructor(componentType="menuComponent") {
        super(componentType, "menuComponent");
        this.menu = React.createRef();
        this.physicsSibling = null;
    }

    linkSibling(component) {
        if (component.toString().split("::")[1] === "physicsComponent") {
            this.physicsSibling = component;
        }
    }

    update(gameCore, delta) {
        if (this.physicsSibling === null) {
            throw new Error("physicsSibling not defined.")
        }

        if(this.menu.current) {
            // This is where you would access the menu from.
        }
    }

    addComponent(gameCore, delta) {
        gameCore.addMenu(<TrialReactMenu ref={this.menu}/>)
    }

    removeComponent(gameCore) {

    }
}

class TrialReactMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "This is a default message!"
        };
    }

    update(message) {
        // if invoked, set new state
        this.setState({message})
    }

    render() {
        const { message } = this.state;
        return (
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "4px",
                    padding: "4px",
                    right: "4px",
                    top: "4px",
                    position: "absolute"
                }}
            >
                <p>{message}</p>
            </div>
        )
    }
}