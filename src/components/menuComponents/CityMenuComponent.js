// TODO figure out how to link in the informationComponent.

import React, { Component } from 'react';
import { Card, List } from 'antd';
import MenuComponent from "../MenuComponent";
import Logger from "../../utils/Logger";



const logger = Logger.getLogger();

export default class CityMenuComponent extends MenuComponent {
    constructor() {
        super(CityReactComponent, "cityMenuComponent");

        this.informationSibling = null;
    }

    linkSibling(component, gameCore) {
        if (component.superType === "informationComponent") {
            this.informationSibling = component;
        } else if (component.superType === "renderComponent") {
            // Don't need to store the ref to the renderComponent, just need to link it
            component.addEventListeners("pointertap", (ev) => {
                if (!gameCore.renderCore.dragging && super.toggleVisible()) {
                    logger.info("SETTING MENU?");
                    gameCore.menuCore.setMenu(this, "BOTTOMRIGHT");
                }
            });
        }
    }

    getReactComponent() {
        // TODO tell game menu to update from this part c;
        return super.getReactComponent(
            <this.reactComponent
                ref={this.menu}
                cityName={this.informationSibling.details.cityName}
            />
        )
    }
}


class CityReactComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
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
                <List
                    size="small"
                    bordered
                    dataSource={[
                        ["Name", this.props.cityName]
                    ]}
                    renderItem={item => (<List.Item><h4>{item[0]}:</h4>&nbsp;{item[1]}</List.Item>)}
                />
            </Card>
        )
    }
}