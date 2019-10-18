import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createAppContainer } from "react-navigation";
import SwipeTabBarIcon from "./src/components/SwipeTabBarIcon";
import Colors from "./src/constants/colors";

import SwipeScreen from "./src/screens/SwipeScreen";

SwipeScreen.navigationOptions = {
  tabBarIcon: ({ focused }) => <SwipeTabBarIcon focused={focused} />,
  tabBarOptions: {
    activeTintColor: Colors.tintColor,
    inactiveTintColor: Colors.inactiveTintColor
  }
};

const tabNavigator = createBottomTabNavigator({
  Swipe: SwipeScreen
});

export default createAppContainer(tabNavigator);
