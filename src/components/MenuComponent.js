/*
*
* Food for thought.
* State is not held from component between unmount and remount
* Props can change as if they were passed from a regular component due to rate of refreshes.
* State should be used within context for things like modals/inputs and the likes.
*
* */

import React, { Component } from 'react';
import GameComponent from "./GameComponent";

import { Card } from 'antd';


export default class MenuComponent extends GameComponent {
    constructor(reactComponent, componentType="menuComponent") {
        super(componentType, "menuComponent");
        this.visible = true;
        this.added = true;
        this.menu = React.createRef();
        this.reactComponent = reactComponent;
    }

    update(gameCore, delta) {
        return true;
    }

    toggleVisible(value="toggle") {
        if (value !== "toggle") {
            this.visible = value;
        } else {
            this.visible = !this.visible;
        }
        return this.visible;
    }

    getReactComponent(component=false) {
        if (!component) {
            component = <this.reactComponent ref={this.menu}/>
        }

        if (this.visible) {
            return component;
        }
    }
}

export class TrialReactMenu extends Component {
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
            <Card
                title="Default Menu"
                style={{
                    right: "-99 vw",
                    bottom: "-99 vh",
                    position: "absolute"
                }}
            >
                <p>{message}</p>
            </Card>
        )
    }
}