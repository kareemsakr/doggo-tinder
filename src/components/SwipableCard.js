import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Card from "../components/Card";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const toRadians = angle => angle * (Math.PI / 180);
const rotatedWidth =
  SCREEN_WIDTH * Math.sin(toRadians(90 - 15)) +
  SCREEN_HEIGHT * Math.sin(toRadians(15));
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
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position
  ];
}
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
  greaterThan
} = Animated;

export default class SwipableCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const TOSS_SEC = 0.2;

    this.dragX = new Value(0);
    this.dragY = new Value(0);
    this.gestureState = new Value(State.UNDETERMINED);
    this.dragVX = new Value(0);
    this.dragVY = new Value(0);
    this.prevDragX = new Value(0);
    this.prevDragY = new Value(0);

    this.onGestureEvent = event([
      {
        nativeEvent: {
          translationX: this.dragX,
          velocityX: this.dragVX,
          translationY: this.dragY,
          velocityY: this.dragVY,
          state: this.gestureState
        }
      }
    ]);
    this.init();
  }

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
          runSpring(clockY, this.dragY, this.dragVY + this.dragVX, 0)
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
        set(
          this.dragX,
          runSpring(clockX, this.dragX, this.dragVY + this.dragVX, snapPoint)
        ),
        set(this.prevDragX, this.dragX),
        cond(and(eq(clockRunning(clockX), 0), neq(this.dragX, 0)), [
          call([this.dragX], this.props.swipped)
        ]),
        this.dragX
      ],
      cond(
        eq(this.gestureState, State.BEGAN),
        [stopClock(clockX), this.dragX],
        this.dragX
      )
    );
  }

  render() {
    const rotateZ = concat(
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
    return (
      <PanGestureHandler
        onGestureEvent={this.onGestureEvent}
        onHandlerStateChange={this.onGestureEvent}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              transform: [
                { translateX: this.translateX },
                { translateY: this.translateY },
                { rotateZ }
              ]
            }
          ]}
        >
          <Card
            profile={this.props.profile}
            likeOpacity={likeOpacity}
            nopeOpacity={nopeOpacity}
          />
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
