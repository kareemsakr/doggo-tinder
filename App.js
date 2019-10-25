import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { setNavigator } from "./src/navigationRef";

import Colors from "./src/constants/colors";

import SwipeTabBarIcon from "./src/components/SwipeTabBarIcon";
import ProfileTabBarIcon from "./src/components/ProfileTabBarIcon";
import MatchesTabBarIcon from "./src/components/MatchesTabBarIcon";
import SwipeScreen from "./src/screens/SwipeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import UpdateProfileScreen from "./src/screens/UpdateProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import MatchesScreen from "./src/screens/MatchesScreen";
//import ChatScreen from "./src/screens/ChatScreen";
import ChatScreen from "./src/screens/ChatScreenGifted";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignUpScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";

SwipeScreen.navigationOptions = {
  tabBarIcon: ({ focused }) => <SwipeTabBarIcon focused={focused} />,
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
    inactiveTintColor: Colors.inactiveTintColor
  }
};

const ProfileStackNavigator = createStackNavigator({
  ProfileScreen,
  SettingsScreen,
  UpdateProfileScreen
});

ProfileStackNavigator.navigationOptions = {
  tabBarIcon: ({ focused }) => <ProfileTabBarIcon focused={focused} />,
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
    inactiveTintColor: Colors.inactiveTintColor
  }
};

MatchesScreen.navigationOptions = {
  title: "Matches",
  headerTintColor: Colors.tintColor,
  headerBackTitle: " "
};
const MatchesStackNavigator = createStackNavigator({
  MatchesScreen,
  ChatScreen
});

MatchesStackNavigator.navigationOptions = {
  tabBarIcon: ({ focused }) => <MatchesTabBarIcon focused={focused} />,
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
    inactiveTintColor: Colors.inactiveTintColor
  }
};

const tabNavigator = createBottomTabNavigator(
  {
    Profile: ProfileStackNavigator,
    Swipe: SwipeScreen,
    Matches: MatchesStackNavigator
  },
  {
    initialRouteName: "Swipe"
  }
);

SignupScreen.navigationOptions = {
  header: null
};

LoginScreen.navigationOptions = {
  header: null
};

const switchNavigator = createSwitchNavigator({
  ResolveAuthScreen,
  LoginFlow: createStackNavigator({
    Login: LoginScreen,
    Signup: SignupScreen
  }),
  mainFlow: tabNavigator
});

const App = createAppContainer(switchNavigator);

export default () => {
  return <App ref={navigator => setNavigator(navigator)} />;
};
