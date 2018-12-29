// TODO figure out how to link in the informationComponent.

import React, { Component } from 'react';
import { Card, List, Row, Col } from 'antd';
import MenuComponent from "../MenuComponent";
import Logger from "../../utils/Logger";


const logger = Logger.getLogger();

export default class CityMenuComponent extends MenuComponent {
    constructor(gameCore, gameObject) {
        const reactComponent = CityReactComponent;
        super(gameCore, gameObject, reactComponent, "cityMenuComponent");

        this.informationSibling = null;
        this.productionSibling = null;
    }

    linkSibling(component, gameCore) {
        if(component.superType === "productionComponent") {
            this.productionSibling = component;
        } else if (component.superType === "informationComponent") {
            this.informationSibling = component;
        } else if (component.superType === "renderComponent") {
            // Don't need to store the ref to the renderComponent, just need to link it
            component.addEventListeners("pointertap", (ev) => {
                if (!gameCore.renderCore.dragging) {
                    gameCore.menuCore.setMenu(this, "BOTTOMRIGHT", true);
                }
            });
        }
    }

    getReactComponent(gameCore) {
        // TODO tell game menu to update from this part c;
        return super.getReactComponent(
            gameCore,
            <this.reactComponent
                ref={this.menu}
                cityName={this.informationSibling.details.cityName}
                productionComponent={this.productionSibling}
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
        const {cityName, productionComponent} = this.props;
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
                        ["Name", cityName]
                    ]}
                    renderItem={item => (<List.Item><h4>{item[0]}:</h4>&nbsp;{item[1]}</List.Item>)}
                />
                <Row>
                    <Col span={12}>
                        <h4>Stockpile</h4>
                        <List
                            size="small"
                            bordered
                            dataSource={Object.keys(productionComponent.stockpile).map((key) => {
                                return [key, productionComponent.stockpile[key]]
                            })}
                            renderItem={item => (<List.Item><h4>{item[0]}:</h4>&nbsp;{item[1]}</List.Item>)}
                        />
                    </Col>
                    <Col span={12}>
                        <h4>Stockpile</h4>
                        <List
                            size="small"
                            bordered
                            dataSource={Object.keys(productionComponent.stockpile).map((key) => {
                                return [key, productionComponent.stockpile[key]]
                            })}
                            renderItem={item => (<List.Item><h4>{item[0]}:</h4>&nbsp;{item[1]}</List.Item>)}
                        />
                    </Col>
                </Row>
            </Card>
        )
    }
}