Skip to content
 
Search or jump to…

Pull requests
Issues
Marketplace
Explore
  Sign out
3
0 0 hschat/app
 Code  Issues 3  Pull requests 3  Insights
app/screens/search/SearchScreenAddMember.js
b1c4a3b  2 days ago
 LouisaSchirmer Button on GroupInfo, Navigation to duplicate SearchScreen
     
318 lines (273 sloc)  9.19 KB
import React, {Component} from 'react';
import {Alert, Keyboard, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {
    Body, Button, Container, Content, Header, Icon, Input, Item, Left, Right, List, ListItem, Spinner, Text, Thumbnail,
    View, Badge, InputGroup
} from "native-base";

import DropdownAlert from 'react-native-dropdownalert';
import i18n from '../../translation/i18n';

import ModalInput from '../../components/ModalWithInput';


const styles = StyleSheet.create({

    addedUserBox: {
        backgroundColor: '#F1F1F1',
        minHeight: 40,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addedUserButton:{
        marginLeft: 5,
        marginRight:5,
    }


});

export default class CreateGroupChat extends Component {
    static navigationOptions = ({navigation, screenProps}) => {
        const params = navigation.state.params || {};
        return {
            headerTitle: i18n.t('AddMemberSearch-AddMember'),
            headerRight: (
                <Button onPress={params.enterGroupName} transparent><Icon name="ios-add-circle-outline"/></Button>
            )
        };
    };


    constructor(props) {
        super(props);

        this.store = this.props.screenProps.store;
        this.state = {
            search: '',
            users: [],
            usersToAdd: [],
            searched: false,
            loading: false,
            showModal: false,
            groupName: '',
        };

        this.props.navigation.setParams({
            enterGroupName: this.enterGroupName,
        });
    }

    componentDidMount(){
        this.search()
    }

    _updateSearch = (searchText) => {
        this.setState({search: searchText});
        // Search for every new character typed
        this.search(searchText);
    };

    /**
     * search for a given text if the text is not given use the state.search
     * @param text or nothing
     */
    search = (text=null) => {
        let searchText= text===null ? this.state.search : text;
        this.setState({loading: true});
        //Keyboard.dismiss();
        this.store.findUser(searchText).then((users) => {

            //Remove yourself for the search
            users.forEach((current, index) => {
                if (current.id === this.store.user.id) {
                    users.splice(index, 1);
                }
            });
            this.setState({users: users});
            this.setState({loading: false});

        }).catch(error => {
            console.error('Search error:', error);
            this.store.alert = {
                type: 'error',
                title: i18n.t('AddMemberSearch-ErrorSearching'),
                msg: i18n.t('AddMemberSearch-ErrorSearchingMsg')
            };
        });
    };

    /**
     * Opens the Modal to enter the group name
     */
    enterGroupName=()=>{
        if(this.state.usersToAdd.length < 1){
            this.store.alert = {
                type: 'warn',
                title: i18n.t('AddMemberSearch-MissingUser'),
                msg: i18n.t('AddMemberSearch-MissingUserMsg')
            };
        }else{
            this.setState({showModal: true});
        }
    };

    /**
     * Creats a new Chat with all selectet user + the user himself
     */
    createGroup = (name) => {

        //Add yourself to the group
        let users = this.state.usersToAdd;
        users.push(this.store.user);

        let part = [];
        //send only the ids
        users.forEach((user) => {
           part.push(user.id);
        });

        let admins = [];
        // add myself to admin list
        admins.push(this.store.user.id);

        // Creat group Object
        let group = {
            participants: part,
            type: 'group',
            name: name,
            admins: admins,
        };

        this.store.createChat(group).then((chat)=>{
            this.props.navigation.navigate('Chat', {chat: chat});
            this.setState({showModal: false});
        }).catch((error) =>{
            this.store.alert = {
                type: 'error',
                title: i18n.t('AddMemberSearch-InternalError'),
                msg: i18n.t('AddMemberSearch-InternalErrorMsg')
            };
        });

    };

    /**
     * adds a user to the List for users to add to the group, only if he is` nt already in it
     */
    addUser = (user) => {
        let found = false;
        // Check if user is allready added
        this.state.usersToAdd.forEach((current) => {
            if (current.id === user.id) {
                found = true;
                this.removeUser(current)
            }
        });

        if (!found) {
            // if the user is not in the list add him
            let users = this.state.usersToAdd;
            users.push(user);
            this.setState({usersToAdd: users});
        }
        this.search();

    };
    /**
     * remove a user from the list
     * @param user
     */
    removeUser = (user) => {
        this.state.usersToAdd.forEach((current, index) => {
            if (current.id === user.id) {
                let users = this.state.usersToAdd;
                users.splice(index, 1);
                this.setState({usersToAdd: users});
            }
        });
        this.search();
    };

    /**
     * Checks if the user is allready in the addToGroup List
     * @param user to check for
     * @return Bool
     */
    checkInList=(user) =>{
        this.state.usersToAdd.forEach((current, index) => {
            if(current.id===user.id){
                return true;
            }
        });
        return false;
    };

    /**
     * Renders all users in the state users
     * @param user
     * @returns ListItems with users
     */
    renderSearchResult = (user) => {
        let added = false;
        this.state.usersToAdd.forEach((current) => {
            if (current.id === user.id) {
                added=true;
            }
        });

        return (
            <ListItem avatar style={{backgroundColor: 'transparent'}} button={true} onPress={() => this.addUser(user)}>
                <Left>
                    <Thumbnail source={{uri: 'https://api.adorable.io/avatars/200/' + user.email + '.png'}}/>
                </Left>
                <Body>
                <Text>{user.prename} {user.lastname}</Text>
                <Text note>{user.status}</Text>
                </Body>
                <Right>
                    { added &&
                        <Icon style={{color: 'green'}} name='ios-checkmark-circle-outline'/>
                    }
                    { !added &&
                        <Icon name='ios-add-circle-outline'/>
                    }

                </Right>
            </ListItem>
        )
    };

    renderSearchInput = () => {
        return (
            <View searchBar style={{flexDirection: 'row', padding: 10}}>

                <InputGroup rounded style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    height: 30,
                    paddingLeft: 10,
                    paddingRight: 10
                }}>
                    <Icon name="ios-search"/>
                    <Input style={{height: 20}} onChangeText={(text) => this._updateSearch(text)}
                           placeholder={i18n.t('AddMemberSearch-SearchUser')}/>
                </InputGroup>
            </View>
        )
    };

    renderNoUserFound = () => {
        return (
            <List>
                <ListItem style={{backgroundColor: 'transparent'}}>
                    <Body>
                    <Text>{i18n.t('AddMemberSearch-UserNotFound')}</Text>
                    <Text note>{i18n.t('AddMemberSearch-InviteUser')}</Text>
                    </Body>
                </ListItem>
            </List>
        )
    };

    closeModal=()=>{
        this.setState({showModal: false});
    };


    render() {

        return (
            <Content>
                {this.renderSearchInput()}

                <View style={styles.addedUserBox}>
                    <ScrollView horizontal={true}>
                        {this.state.usersToAdd.map((user, index) => {
                            return (
                                <Button style={styles.addedUserButton} small key={index} iconRight rounded danger onPress={() => this.removeUser(user)}>
                                    <Text>{user.prename} {user.lastname}</Text>
                                    <Icon name="ios-trash-outline"/>
                                </Button>
                            )
                        })}
                    </ScrollView>
                </View>

                {   //render a spinner if loading is active
                    this.state.loading &&
                    <Spinner color='rgb(216, 0, 48)'/>
                }

                {   // if not search results are found
                    (this.state.users.length === 0 && !this.state.loading ) &&
                    this.renderNoUserFound()
                }

                {   // if some users are found
                    (this.state.users.length !== 0 && !this.state.loading) &&
                    <List dataArray={this.state.users} renderRow={this.renderSearchResult}></List>
                }
            </Content>
        );

    }
}
© 2018 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About
Press h to open a hovercard with more details.