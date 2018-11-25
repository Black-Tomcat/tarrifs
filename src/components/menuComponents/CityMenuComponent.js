// TODO figure out how to link in the informationComponent.

import React, { Component } from 'react';
import { Card } from 'antd';
import MenuComponent from "../MenuComponent";


export default class CityMenuComponent extends MenuComponent {
    constructor() {
        super(CityReactComponent, "cityMenuComponent");

        this.informationSibling = null;
    }

    linkSibling(component) {
        if (component.superType === "informationComponent") {
            this.informationSibling = component;
        }
    }

    addComponent(gameCore) {
        gameCore.addMenu(<this.reactComponent ref={this.menu}/>)
    }
}


class CityReactComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    update(message) {
        this.setState({
            ...message
        })
    }

    render() {
        return (
            <Card
                title={"City Menu Component"}
                style={{
                    width: 500,
                    position: "absolute",
                    bottom: 10,
                    right: 10
                }}
            >

            </Card>
        )
    }
}