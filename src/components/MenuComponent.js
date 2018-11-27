import React, { Component } from 'react';
import GameComponent from "./GameComponent";

import { Card } from 'antd';


export default class MenuComponent extends GameComponent {
    constructor(reactComponent, componentType="menuComponent") {
        super(componentType, "menuComponent");
        this.visible = true;
        this.added = false;
        this.menu = React.createRef();
        this.reactComponent = reactComponent;
    }

    update(gameCore, delta) {
        if (this.visible && !this.added) {
            gameCore.addMenu(<this.reactComponent ref={this.menu}/>);
            this.added = true;
        } else if (!this.visible && this.added) {
            gameCore.removeMenu(<this.reactComponent ref={this.menu}/>);
            this.added = false;
        }

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