import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import SwipeTabBarIcon from "./src/components/SwipeTabBarIcon";
import ProfileTabBarIcon from "./src/components/ProfileTabBarIcon";
import MatchesTabBarIcon from "./src/components/MatchesTabBarIcon";

import Colors from "./src/constants/colors";

import SwipeScreen from "./src/screens/SwipeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import MatchesScreen from "./src/screens/MatchesScreen";
//import ChatScreen from "./src/screens/ChatScreen";
import ChatScreen from "./src/screens/ChatScreenGifted";

SwipeScreen.navigationOptions = {
  tabBarIcon: ({ focused }) => <SwipeTabBarIcon focused={focused} />,
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
    inactiveTintColor: Colors.inactiveTintColor
  }
};

const ProfileStackNavigator = createStackNavigator({
  ProfileScreen,
  SettingsScreen
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

export default createAppContainer(tabNavigator);
