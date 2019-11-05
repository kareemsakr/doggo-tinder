import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Text,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";

import FirebaseSDK from "../services/Firebase";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const toRadians = angle => angle * (Math.PI / 180);
const rotatedWidth =
  SCREEN_WIDTH * Math.sin(toRadians(90 - 15)) +
  SCREEN_HEIGHT * Math.sin(toRadians(15));

const {
  event,
  set,
  eq,
  cond,
  clockRunning,
  Clock,
  Value,
  stopClock,
  startClock,
  spring,
  debug,
  lessThan,
  defined,
  add,
  multiply,
  sub,
  and,
  neq,
  call,
  concat,
  interpolate,
  Extrapolate,
  greaterThan,
  or
} = Animated;

function runSpring(clock, value, velocity, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = {
    damping: 20,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 1,
    restDisplacementThreshold: 0.5,
    toValue: new Value(0)
  };

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, new Value(1)),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ];
}

export default class SwipeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profiles: [],
      currentIndex: 0,
      matchModalVisible: false
    };

    const TOSS_SEC = 0.2;

    this.dragX = new Value(0);
    this.dragY = new Value(0);
    this.gestureState = new Value(State.UNDETERMINED);
    this.dragVX = new Value(0);
    this.dragVY = new Value(0);
    this.prevDragX = new Value(0);
    this.prevDragY = new Value(0);

    this.onGestureEvent = event(
      [
        {
          nativeEvent: {
            translationX: this.dragX,
            velocityX: this.dragVX,
            translationY: this.dragY,
            velocityY: this.dragVY,
            state: this.gestureState
          }
        }
      ],
      { useNativeDriver: true }
    );

    this.init();
  }
  static defaultProps = {
    likeOpacity: 1,
    nopeOpacity: 1
  };

  init() {
    this.dragX.setValue(0);
    this.dragY.setValue(0);

    this.gestureState.setValue(State.UNDETERMINED);
    this.dragVX.setValue(0);
    this.dragVY.setValue(0);

    this.prevDragX.setValue(0);
    this.prevDragY.setValue(0);

    const clockX = new Clock();
    const clockY = new Clock();
    const finalTranslateX = add(this.dragX, multiply(0.2, this.dragVX));
    const translationThreshold = SCREEN_WIDTH / 4;
    const snapPoint = cond(
      lessThan(finalTranslateX, -translationThreshold),
      -rotatedWidth,
      cond(greaterThan(finalTranslateX, translationThreshold), rotatedWidth, 0)
    );
    this.translateY = cond(
      eq(this.gestureState, State.END),
      [
        set(
          this.dragY,
          runSpring(clockY, this.dragY, add(this.dragVX, this.dragVY), 0)
        ),
        set(this.prevDragY, this.dragY),
        this.dragY
      ],
      cond(
        eq(this.gestureState, State.BEGAN),
        [stopClock(clockY), this.dragY],
        this.dragY
      )
    );
    this.translateX = cond(
      eq(this.gestureState, State.END),
      [
        cond(
          and(
            or(
              lessThan(finalTranslateX, -translationThreshold),
              greaterThan(finalTranslateX, translationThreshold)
            ),
            eq(clockRunning(clockX), 0)
          ),
          [call([this.dragX], this.beforeSwiped)]
        ),
        set(
          this.dragX,
          runSpring(
            clockX,
            this.dragX,
            add(this.dragVX, this.dragVY),
            snapPoint
          )
        ),
        set(this.prevDragX, this.dragX),
        this.dragX
      ],
      cond(
        eq(this.gestureState, State.BEGAN),
        [stopClock(clockX), this.dragX],
        this.dragX
      )
    );
  }

  onMatch = () => {};

  beforeSwiped = ([translateX]) => {
    if (translateX > 0) {
      //console.log("liked ", this.state.profiles[this.state.currentIndex].id);
      FirebaseSDK.addLike(this.state.profiles[this.state.currentIndex].id, () =>
        this.setState({ matchModalVisible: true })
      );
    }
    this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
      this.init();
    });
  };

  getProfilesForSwiping = () => {
    FirebaseSDK.getProfilesForSwiping(async snapshot => {
      const profile = await FirebaseSDK.getUserProfileOnce();
      let res = [];
      // console.log(snapshot.val());
      snapshot.forEach(function(childSnapshot) {
        if (
          childSnapshot.val().id !== profile.id &&
          !(childSnapshot.val().id in (profile.likes || {}))
        ) {
          res = [...res, childSnapshot.val()];
        }
      });

      this.setState({ profiles: res, currentIndex: 0 });
    });
  };

  async componentDidMount() {
    FirebaseSDK.setUserProfile();
    this.getProfilesForSwiping();
  }
  componentWillUnmount() {}
  render() {
    // console.log(this.state.profiles);
    const rotate = concat(
      interpolate(this.translateX, {
        inputRange: [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2],
        outputRange: [15, -15],
        extrapolate: Extrapolate.CLAMP
      }),
      "deg"
    );
    const likeOpacity = interpolate(this.translateX, {
      inputRange: [0, SCREEN_WIDTH / 4],
      outputRange: [0, 1]
    });
    const nopeOpacity = interpolate(this.translateX, {
      inputRange: [-SCREEN_WIDTH / 4, 0],
      outputRange: [1, 0]
    });
    const nextCardScale = interpolate(this.translateX, {
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: "clamp"
    });

    const { onGestureEvent } = this;
    return (
      <View style={styles.container}>
        <Modal
          isVisible={this.state.matchModalVisible}
          animationIn={"slideInUp"}
          animationOut={"slideOutDown"}
        >
          <View style={styles.modalContent}>
            <Text>Congrats you've matched with a user!</Text>
            <Button
              title="Go to matches"
              onPress={() => {
                this.setState({ matchModalVisible: false });
                this.props.navigation.navigate("Matches");
              }}
            />
            <Button
              title="Keep swiping"
              onPress={() => this.setState({ matchModalVisible: false })}
            />
          </View>
        </Modal>

        <PanGestureHandler
          {...{ onGestureEvent }}
          onHandlerStateChange={onGestureEvent}
        >
          <Animated.View
            style={[StyleSheet.absoluteFill, { justifyContent: "center" }]}
          >
            <Ionicons
              name="md-refresh"
              size={32}
              style={{ alignSelf: "center" }}
              onPress={this.getProfilesForSwiping}
            />
            {this.state.profiles
              .map((d, i) => {
                if (i < this.state.currentIndex) {
                  return null;
                }
                return (
                  <Animated.View
                    key={d.id}
                    style={[
                      StyleSheet.absoluteFillObject,
                      i == this.state.currentIndex
                        ? {
                            transform: [
                              { translateX: this.translateX },
                              { translateY: this.translateY },
                              { rotate }
                            ]
                          }
                        : { transform: [{ scale: nextCardScale }] }
                    ]}
                  >
                    <Card
                      profile={d}
                      likeOpacity={
                        i == this.state.currentIndex ? likeOpacity : 0
                      }
                      nopeOpacity={
                        i == this.state.currentIndex ? nopeOpacity : 0
                      }
                    />
                  </Animated.View>
                );
              })
              .reverse()}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    justifyContent: "center"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: 250
  }
});
