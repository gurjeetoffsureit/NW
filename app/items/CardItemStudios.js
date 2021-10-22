import React, { PureComponent } from 'react';
import { ImageBackground, Image, Dimensions } from 'react-native';
import {
    Container, Header, Content, Card, CardItem, Thumbnail,
    Text, Button, Icon, Left, Body, Right
} from 'native-base';

const placeholder = require('../resources/images/no_image.jpg');
const { width } = Dimensions.get('window');

export default class CardItemStudios extends PureComponent {

    render() {
        return (
            <Container style={{ padding: 10, paddingBottom: 3, paddingTop: 3, height: null }}>
                <Content>
                    <Card>
                        <CardItem>
                            <Left>
                                <Image source={placeholder} style={{ height: width / 3, width: width / 3 }} />
                                <Body>

                                </Body>
                            </Left>
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        );
    }
}