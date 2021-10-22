import React, { Component } from 'react';
import { StatusBar, View, StyleSheet, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
import { Container, Content, Header, Left, Icon, Button, Right, Text, Body, ListItem, Thumbnail } from 'native-base';
import { Calendar } from 'react-native-calendars';
import Styles from '../resources/styles/Styles';
import Strings from '../resources/string/Strings';
import Font from '../resources/styles/Font';
import Moment from 'moment';
import webService from '../global/WebServiceHandler';
import Services from '../constants/WebServices';
import Loading from '../global/Loader';

const dateFormat = 'YYYY-MM-DD';
const premium = Styles.textPremium;

class More extends Component {

    constructor(props) {
        super(props);
        this.state = {
            calendar: true,
            access_token: props.navigation.state.params ? props.navigation.state.params.access_token : '',
            data: [],
            returnData: props.navigation.state.params ? props.navigation.state.params.returnData : undefined,
            selected: props.navigation.state.params ? props.navigation.state.params.date : Moment(new Date()).format('YYYY-MM-DD'),
            loading: true
        };
    }

    static navigationOptions = {
        header: null,
        gesturesEnabled: false
    }

    componentDidMount() {
        this._fetchRoomsByDate(this.state.selected, this.state.access_token)
    }

    _goBack = () => {
        this.props.navigation.goBack();
    }

    _fetchRoomsByDate = (date, access_token) => {
        webService.get(`${Services.Url}${Services.App}${Services.Book}availabile/${Services.Rooms}?date=${date}`, {
            'content-type': 'application/json',
            'x-content-type': 'application/json',
            'authorization-key': Services.AuthKey,
            'token': access_token
        }).then(response => {
            console.log('Response is :', response);
            if (response) {
                this.setState({ loading: false, data: response.data });
            }
        }).catch(error => {
            this.setState({ loading: false }, function () {
                if ('name' in error && error.name == '503') {
                    setTimeout(() => {
                        alert(error.message);
                    }, 100);
                }
                else {
                    setTimeout(() => {
                        alert(error.message);
                    }, 100);
                }
            });
            console.log('callapi error :' + JSON.stringify(error));
        });
    }

    onDayPress(day) {
        this.setState({
            selected: day.dateString,
            loading: true,
        }, function () {
            this._fetchRoomsByDate(day.dateString, this.state.access_token)
        });
    }

    onCallClicked = (number) => {
        // alert(number);
        return;
        this.makePhoneCall(`${number}`);
    }

    _keyExtractor = (item) => item._id;

    _renderRooms = ({ item }) => {
        console.log(`Item is : `, item.name);
        const { selected } = this.state
        var weekDay = new Date(selected).getDay();
        var index = AppData.weekdays.findIndex((week) => week.day === weekDay);
        var close = false;
        if (index > -1) {
            let day = AppData.weekdays[index].weekday.toLowerCase();
            if ('workingDays' in item) {
                if (item.workingDays.length > 0) {
                    let dayIndex = item.workingDays.findIndex((days) => days.day.toLowerCase() === day);
                    if (dayIndex > -1) {
                        close = item.workingDays[dayIndex].closed;
                        console.log(`Closed is : ${item.workingDays[dayIndex].closed}`);
                    }
                }
            }
        }
        return (
            <ListItem thumbnail button
                onPress={() => {
                    const { returnData } = this.state;
                    if (returnData) {
                        this.state.returnData(item._id, item.studio._id, selected);
                        this._goBack();
                    } else {
                        this.props.navigation.navigate("Reservation", {
                            roomId: item._id, studioId: item.studio._id, date: selected
                        });
                    }
                }}
                style={{ paddingBottom: 8, marginTop: 8, borderBottomColor: '#FDA02A', borderBottomWidth: 0.5 }}>
                <Left style={{ backgroundColor: 'red' }}>
                    <Thumbnail square large source={
                        { uri: Services.Url + Services.Media + item.studio.image }
                    }
                        defaultSource={require('../resources/images/no_image.jpg')}
                    />
                </Left>
                <View style={{ height: '100%', flexDirection: 'column', marginStart: 8, marginEnd: 8, flex: 1 }}>
                    <Text numberOfLines={1}
                        ellipsizeMode='tail'
                        style={[Styles.label, { flex: 1, color: 'white', alignSelf: 'flex-start' }]}>{item.name}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 0 }}>
                        {item.premium && <Text style={[premium, { fontWeight: '100' }]}>{Strings.TEXT_PREMIUM}</Text>}
                        {item.verified && <Text style={[premium, { fontWeight: '100' }]}>{Strings.TEXT_VERIFIED}</Text>}
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 0 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <Text numberOfLines={1}
                                ellipsizeMode='tail'
                                style={[Styles.label, {
                                    textAlign: 'left', marginRight: 3,
                                    marginLeft: 0, fontSize: 24, color: 'white'
                                }]} >${
                                    ('pricing' in item) ?
                                        item.pricing.length > 0 && item.pricing[0].price
                                        : 0
                                }</Text>
                            <Text numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{
                                    color: 'white', fontSize: Font.Small, textAlign: 'left',
                                    alignSelf: 'center'
                                }}>{Strings.TEXT_PER_SESSION}</Text>
                        </View>
                        {
                            !close && <TouchableOpacity
                                style={{
                                    flex: 0.25, alignItems: 'center', justifyContent: 'center',
                                }}
                                onPress={() => {
                                    this.onCallClicked(item.studio.phoneNumber);
                                }}>
                                <Image
                                    source={require('../resources/images/call_icon.png')} />
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </ListItem>
        );
    }

    render() {
        const { calendar, loading, selected, data } = this.state;
        return (
            <Container style={{ backgroundColor: 'black' }}>
                <Header style={{ backgroundColor: 'black', borderBottomColor: '#FDA02A' }}>
                    <Left>
                        <Button transparent style={{ paddingStart: 15, }}
                            onPress={() => {
                                this._goBack();
                            }}>
                            {/* <Icon name='arrow-back' style={{ color: '#FDA02A' }}></Icon> */}
                            <Image source={require('../resources/images/back_arrow.png')} />
                        </Button>
                    </Left>
                    <Body style={{
                        ...Platform.select({
                            ios: {alignItems: 'center', justifyContent: 'center'},
                            android:{alignItems: 'flex-end', justifyContent: 'flex-end'}
                        })
                    }}>
                        <Text style={{ color: '#FDA02A' }}>Studios</Text>
                    </Body>
                    <Right>
                        {/* <Button transparent
                            onPress={() => {
                                this.setState({ calendar: !this.state.calendar });
                            }}>
                            <Icon name='calendar' type='EvilIcons' style={{ color: '#FDA02A' }}></Icon>
                        </Button> */}
                    </Right>
                </Header>
                <StatusBar
                    backgroundColor="#595656"
                    barStyle="light-content" />
                <Loading loading={loading} />
                <Content contentContainerStyle={{ flex: 1 }} scrollEnabled={false}>
                    {
                        calendar && <Calendar
                        theme={{calendarBackground:'black',
                        selectedDayTextColor: 'black',
                        arrowColor: 'white',monthTextColor: 'white',}}
                            // onMonthChange={this.onMonthChange.bind(this)}
                            style={styles.calendar}
                            minDate={Moment(new Date()).format(dateFormat)}
                            onDayPress={this.onDayPress.bind(this)}
                            // onPressArrowLeft={this.onPressArrowLeft.bind(this)}
                            // onPressArrowRight={this.onPressArrowRight.bind(this)}
                            markedDates={{
                                [selected]: { selected: true,selectedColor: 'white' },
                            }}
                            displayLoadingIndicator={true}
                            hideExtraDays={true}
                            hideArrows={false}
                        />
                    }
                    {
                        data && data.length > 0 ? <FlatList
                            style={{ marginEnd: 12, marginBottom: 8 }}
                            data={data}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderRooms} /> :
                            !loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[Styles.noData, { color: '#FDA02A' }]}>No Rooms Found</Text>
                            </View>
                    }
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    calendar: {
        borderBottomWidth: 0.5,
        borderColor: '#FDA02A',backgroundColor:'black'
    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee'
    },
    container: {
        flex: 1,
        backgroundColor: 'gray'
    }
});

export default More;