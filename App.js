import React, {Component} from 'react';
import {Root, View, Text} from 'native-base';
import DropdownAlert from 'react-native-dropdownalert';


import ApiStore from "./ApiStore";
import MainNavigator from "./components/MainNavigator";
import UnauthenticatedNavigator from "./components/LaunchNavigator";
import {autobind} from "core-decorators";
import {observer} from "mobx-react";
import {observe} from "mobx";
import { NavigationActions } from 'react-navigation';


@autobind @observer
export default class App extends Component {

    constructor(props) {
        super(props);
        this.store = new ApiStore();
        observe(this.store, "alert", this.showAlert, true);
    }

    async componentWillMount() {
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
    }


    showAlert = () => {
        if (Object.keys(this.store.alert).length === 0) return;
        this.dropdown.alertWithType(this.store.alert.type, this.store.alert.title, this.store.alert.msg);
        
    };

    onClose(data) {
        console.log('DROPDOWN NAV CLOSED', data);
        if (data.action === 'tap') {
            // get the chat object from the id
            // navigate to chat with the user
            this.store.findChat(this.store.alert.chat_id).then((chat)=>{
                console.log(chat);
                this.navigator && this.navigator.dispatch(
                    NavigationActions.navigate(
                        {
                            routeName: 'Chats',
                            //params: {chat: this.store.alert.chat_id},
                            action: NavigationActions.navigate({ routeName: 'Chat', params: {chat: chat[0]}})
                        })
                );
            });
        }
        this.store.alert = {};
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <DropdownAlert
                    ref={ref => this.dropdown = ref}
                    onClose={data => this.onClose(data)}
                    zIndex={10}
                />
                <Root>
                    {
                        this.store.isAuthenticated ? <MainNavigator ref={nav => { this.navigator = nav; }} screenProps={{store: this.store}}/> :
                            <UnauthenticatedNavigator screenProps={{store: this.store}}/>
                    }
                </Root>
            </View>
        );
    }
}


