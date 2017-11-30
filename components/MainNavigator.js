import React from 'react';
import {TabNavigator, StackNavigator} from 'react-navigation';
import {Icon, Button} from "native-base";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ChatsScreen from "../screens/chats/ChatsScreen";
import SearchScreen from "../screens/search/SearchScreen";
import InviteScreen from "../screens/search/InviteScreen";
import ChatScreen from "../screens/chats/ChatScreen";

const profileNavigator = StackNavigator({
  Home: {
    screen: ProfileScreen,
    navigationOptions: {
      headerTitle: 'Profil',
    }
  }
});


const searchNavigator = StackNavigator({
  Home: {
    screen: SearchScreen,
    navigationOptions: {
      headerTitle: 'Suchen',
    }
  },

  View: {
    screen: ProfileScreen,
    navigationOptions: {
      headerTitle: 'Suchergebnis',
    }
  },
  Invite: {
    screen: InviteScreen,
    navigationOptions: {
      headerTitle: 'Einladen',
    }
  }

});

/**
 * Subnavigator that
 */
const chatsNavigator = StackNavigator({
  Home: {
    screen: ChatsScreen,
    navigationOptions: {
      headerTitle: 'Chats',
    }
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      headerTitle: 'Chat',
      tabBarVisible: false
    }
  }
});

/**
 * Tab Navigation that contains the references to the components based above
 */
const RootTabs = TabNavigator({
    Profile: {
      screen: profileNavigator,
      navigationOptions: {
        tabBarLabel: 'Profil',
        tabBarIcon: <Icon ios='ios-person-outline' android='md-person' size={20}/>
      }
    },
    Chats: {
      screen: chatsNavigator,
      navigationOptions: {
        tabBarLabel: 'Nachrichten',
        tabBarIcon: <Icon ios='ios-text-outline' android='md-chatboxes' size={20}/>
      }

    },
    Search: {
      screen: searchNavigator,
      navigationOptions: {
        tabBarLabel: 'Suchen',
        tabBarIcon: <Icon ios='ios-search-outline' android='md-search' size={20}/>
      }
    }
  }
);

export default RootTabs;