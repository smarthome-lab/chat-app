import React, {Component} from 'react';
import {
    Text,
    View,
    Button,
    H3,
    Icon,
    Item,
    ListItem,
    Content,
    Label,
    Input,
    Form,
    CheckBox,
    List,
    Body,
    Left,
    Right,
    Spinner,
    Switch,
    Toast,
    Thumbnail
} from "native-base";
import {StyleSheet, Image, Alert, Dimensions, TouchableOpacity} from 'react-native';
import BaseStyles from '../../baseStyles';


const styles = StyleSheet.create({
    image: {
        height: 100,
        borderRadius: 50,
        width: 100,
    },
    header: {
        fontWeight: 'bold'
    },
    subheader: {
        color: '#999999'
    },
    middle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    left: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    roundedIcon: {
        backgroundColor: '#ff3232',
        padding: 10,
        borderRadius: 100,
        width: 47,
        height: 47,
    },
    item: {
        borderBottomWidth: 0,
    }
});


export default class UserSettingsScreen extends Component {

    static navigationOptions = ({navigation, screenProps}) => {
        // No logout button for other profiles
        if (navigation.state.hasOwnProperty("params") && navigation.state.params !== undefined) return {};
        return {
            headerLeft: (
                <Button onPress={() => navigation.navigate('Home')} transparent><Icon
                    name="ios-arrow-back-outline"/></Button>
            ),
            headerRight: (
                <Button onPress={screenProps.store.promptForLogout} transparent><Text>Abmelden</Text></Button>
            )
        }
    };

    constructor(props) {
        super(props);

        this.store = this.props.screenProps.store;
        
        this.state = {
            user: null,
            ready: false,
            status: '',
            checked: true,
            location: false,
            showStatusModal: false,
            location_is_allowed: null,
        };
    }

    componentDidMount() {
        // Check if there is a user given else print your own profile
        if (this.props.navigation.state.hasOwnProperty('params') && this.props.navigation.state.params !== undefined) {
            let id = this.props.navigation.state.params.id;

            if (id !== undefined) {
                // Try to find the user else print an error
                this.store.getUserInformation(id).then(user => {
                    this.setState({user: user, ready: true});
                }).catch(error => {
                    this.setState({user: this.store.user, ready: false}, () => {
                        this.setState({location_is_allowed: this.store.user.location_is_allowed});
                    });
                    Alert.alert('Fehler', 'Benutzer nicht gefunden');
                });

            } else {
                this.setState({user: this.store.user, ready: true}, () => {
                    this.setState({location_is_allowed: this.store.user.location_is_allowed});
                });
            }
        } else {
            this.setState({user: this.store.user, ready: true}, () => {
                this.setState({location_is_allowed: this.store.user.location_is_allowed});
            });
        }
    }

    _checkBoxHandler() {
        this.setState({ location_is_allowed: !this.state.location_is_allowed },() => {
            this.store.updateAccountPlus(this.store.user, {
                location_is_allowed: this.state.location_is_allowed
            }).then(() => {
                this.store.getUserInformation(this.store.user.id).then(user => 
                    console.log(JSON.stringify(this.store.user)));
                this.store.user.location_is_allowed = this.state.location_is_allowed;
                this.state.user.location_is_allowed;
                console.log('state: ' + this.state.location_is_allowed);
                console.log('store: ' + this.store.user.location_is_allowed);
                console.log('state.user: ' + this.state.user.location_is_allowed);
            }).catch((error) => {
                console.error(error);
            });
        });
    }

    renderSettings = () => {
        return (
            <View>
                <Content>
                    <ListItem style={{width: 200}}>
                        <Body>
                        <Text>Standort erlauben?</Text>
                        </Body>
                        <CheckBox
                            checked={
                                this.state.location_is_allowed
                            }
                            onPress={() => this._checkBoxHandler()}
                        />
                    </ListItem>
                </Content>

            </View>

        )
    };

    render() {

        if (this.state.user === undefined || this.state.user === null)
            return (
                <Spinner style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}
                         color='red'/>
            );

        return (
            <View
                style={{flex: 1, padding: 25, paddingTop: 15, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                <Image style={BaseStyles.backgroundImage} source={require('../../assets/img/bg.png')}/>

                <View style={{marginTop: 10}}>
                    {this.state.user.id === this.store.user.id ? this.renderSettings() : this.renderUserInformations()}
                </View>

            </View>
        );
    }
}
