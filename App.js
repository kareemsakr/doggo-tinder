import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createAppContainer } from "react-navigation";
import SwipeScreen from "./src/screens/SwipeScreen";
import TestSnappable from "./src/screens/TestSnappable";

const tabNavigator = createBottomTabNavigator({
  Swipe: SwipeScreen
});

export default createAppContainer(tabNavigator);
