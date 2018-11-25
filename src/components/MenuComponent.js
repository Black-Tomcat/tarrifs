import React, { Component } from 'react';
import GameComponent from "./GameComponent";

import { Card } from 'antd';


export default class MenuComponent extends GameComponent {
    constructor(reactComponent, componentType="menuComponent") {
        super(componentType, "menuComponent");
        this.menu = React.createRef();
        this.reactComponent = reactComponent;
    }

    update(gameCore, delta) {
        if(this.menu.current) {
            // This is where you would access the menu from.
            this.menu.current.update("This is the new message!")
            return false;
        }

        return true;
    }

    addComponent(gameCore) {
        gameCore.addMenu(<this.reactComponent ref={this.menu}/>)
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
                    right: "4px",
                    bottom: "4px",
                    position: "absolute"
                }}
            >
                <p>{message}</p>
            </Card>
        )
    }
}