import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { PanGestureHandler, State } from "react-native-gesture-handler";

const {
  event,
  set,
  eq,
  or,
  cond,
  clockRunning,
  Clock,
  Value,
  stopClock,
  startClock,
  spring,
  debug,
  divide,
  diff,
  add
} = Animated;

const runSpring = (value, vel, dragState, axis) => {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0)
  };

  const config = {
    toValue: new Value(0),
    damping: 7,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001
  };

  return cond(
    or(
      eq(dragState, State.END),
      eq(dragState, State.CANCELLED),
      eq(dragState, State.FAILED),
      eq(dragState, State.UNDETERMINED)
    ),
    [
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.velocity, vel),
        set(config.toValue, 0),
        debug(`Start clock ${axis}`, startClock(clock))
      ]),
      cond(state.finished, debug(`Stop clock ${axis}`, stopClock(clock))),
      spring(clock, state, config),
      state.position
    ],
    value
  );
};

function interaction(gestureTranslation, gestureState) {
  const dragging = new Value(0);
  const start = new Value(0);
  const position = new Value(0);
  const anchor = new Value(0);
  const velocity = new Value(0);

  const clock = new Clock();
  const dt = divide(diff(clock), 1000);

  const step = cond(
    eq(gestureState, State.ACTIVE),
    [
      cond(dragging, 0, [set(dragging, 1), set(start, position)]),
      set(anchor, add(start, gestureTranslation)),

      // spring attached to pan gesture "anchor"
      spring(dt, position, velocity, anchor),
      damping(dt, velocity),

      // spring attached to the center position (0)
      spring(dt, position, velocity, 0),
      damping(dt, velocity)
    ],
    [
      set(dragging, 0),
      startClock(clock),
      spring(dt, position, velocity, 0),
      damping(dt, velocity)
    ]
  );

  return block([
    step,
    set(position, add(position, multiply(velocity, dt))),
    stopWhenNeeded(dt, position, velocity, clock),
    position
  ]);
}
export default class Card extends React.Component {
  translationX = new Animated.Value(0);

  translationY = new Animated.Value(0);

  velocityX = new Animated.Value(0);

  velocityY = new Animated.Value(0);

  dragState = new Value(0);

  handleGestureEvent = event([
    {
      nativeEvent: {
        velocityX: this.velocityX,
        velocityY: this.velocityY,
        translationX: this.translationX,
        translationY: this.translationY,
        state: this.dragState
      }
    }
  ]);

  position = {
    x: runSpring(this.translationX, this.velocityX, this.dragState, "X"),
    y: runSpring(this.translationY, this.velocityY, this.dragState, "Y")
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#eee",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <PanGestureHandler
          onGestureEvent={this.handleGestureEvent}
          onHandlerStateChange={this.handleGestureEvent}
        >
          <Animated.View
            style={{
              height: "80%",
              width: "80%",
              backgroundColor: "#fff",
              transform: [
                { translateX: this.position.x, translateY: this.position.y }
              ]
            }}
          />
        </PanGestureHandler>
      </View>
    );
  }
}
