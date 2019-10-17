import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createAppContainer } from "react-navigation";
import SwipeScreen from "./src/screens/SwipeScreen";
import TestSnappable from "./src/screens/TestSnappable";
import TestDeckSwipper from "./src/screens/TestDeckSwipper";

const tabNavigator = createBottomTabNavigator({
  Swipe: SwipeScreen,
  Test: TestSnappable,
  Test2: TestDeckSwipper
});

export default createAppContainer(tabNavigator);
