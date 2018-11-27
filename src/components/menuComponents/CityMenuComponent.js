// TODO figure out how to link in the informationComponent.

import React, { Component } from 'react';
import { Card, List } from 'antd';
import MenuComponent from "../MenuComponent";


export default class CityMenuComponent extends MenuComponent {
    constructor() {
        super(CityReactComponent, "cityMenuComponent");

        this.informationSibling = null;
    }

    linkSibling(component) {
        if (component.superType === "informationComponent") {
            this.informationSibling = component;
        } else if (component.superType === "renderComponent") {
            // Don't need to store the ref to the renderComponent, just need to link it
            component.addEventListeners("click", () => {
                super.toggleVisible()
            });
        }
    }

    update(gameCore, delta) {
        super.update(gameCore, delta);
        if (this.menu.current && !this.menu.current.state.initialized) {
            this.menu.current.update({initialized: true, ...this.informationSibling.details});
        }
        return true; // Must always return true due to the nature of the super method.
    }
}


class CityReactComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialized: false,
            cityName: ""
        }
    }

    update(message) {
        this.setState({
            ...message
        })
    }

    render() {
        return (
            <Card
                title={<h1>City Menu Component</h1>}
                style={{
                    width: 500,
                    position: "absolute",
                    bottom: "calc(1vw - 100vh)", // This is to ensure same spacing as 'right' property.
                    right: "-99vw"
                }}
            >
                <h2>Details</h2>
                {
                    this.state.initialized &&
                    <List
                        size="small"
                        bordered
                        dataSource={[
                            ["Name", this.state.cityName]
                        ]}
                        renderItem={item => (<List.Item><h4>{item[0]}:</h4>&nbsp;{item[1]}</List.Item>)}
                    />
                }
            </Card>
        )
    }
}