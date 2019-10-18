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

const dogStack = [
  {
    name: "Sammy",
    age: 3,
    bio: "",
    pic: require("../../assets/dog1.jpeg")
  },
  {
    name: "Rover",
    age: 4,
    bio: "",
    pic: require("../../assets/dog2.jpeg")
  },
  {
    name: "Prince",
    age: 3,
    bio: "",
    pic: require("../../assets/dog3.jpeg")
  },
  {
    name: "Edgar",
    age: 3,
    bio: "",
    pic: require("../../assets/dog4.jpeg")
  },
  {
    name: "Maya",
    age: 3,
    bio: "",
    pic: require("../../assets/dog5.jpeg")
  },
  {
    name: "King",
    age: 3,
    bio: "",
    pic: require("../../assets/dog6.jpeg")
  },
  {
    name: "Doge",
    age: 3,
    bio: "",
    pic: require("../../assets/dog7.jpeg")
  },
  {
    name: "Doggo",
    age: 3,
    bio: "",
    pic: require("../../assets/dog8.jpeg")
  }
];

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

export default class SwipeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profiles: dogStack,
      currentIndex: 0
    };

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

    // If transX has not yet been defined we stay in the center (value is 0).
    // When transX is defined, it means drag has already occured. In such a case
    // we want to snap to -100 if the final position of the block is below 0
    // and to 100 otherwise.
    // We also take into account gesture velocity at the moment of release. To
    // do that we calculate final position of the block as if it was moving for
    // TOSS_SEC seconds with a constant speed the block had when released (dragVX).
    // So the formula for the final position is:
    //   finalX = transX + TOSS_SEC * dragVelocityX
    //

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
          runSpring(clockX, this.dragX, this.dragVY + this.dragVX, snapPoint)
        ),
        set(this.prevDragX, this.dragX),
        cond(and(eq(clockRunning(clockX), 0), neq(this.dragX, 0)), [
          call([this.dragX], this.swipped)
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

  beforeSwiped = () => {
    console.log("setting current index");
    this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
      console.log("current index updated");
      this.init();
    });
  };
  swipped = ([translationX]) => {
    // console.log({ likes: translationX > 0 });
    // const profiles =
    //     this.setState({ profiles}, this.init);
    console.log("spring animation done ");
    // const {
    //   profiles: [lastProfile, ...profiles]
    // } = this.state;
    // this.setState({ profiles }, this.init);
  };
  render() {
    console.log(this.state.currentIndex);
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
    const nextCardScale = interpolate(this.translateX, {
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: "clamp"
    });

    const { onGestureEvent } = this;
    return (
      <View style={styles.container}>
        <PanGestureHandler
          {...{ onGestureEvent }}
          onHandlerStateChange={onGestureEvent}
        >
          <Animated.View style={StyleSheet.absoluteFill}>
            {this.state.profiles
              .map((d, i) => {
                if (i < this.state.currentIndex) {
                  return null;
                }
                return (
                  <Animated.View
                    key={d.name}
                    style={[
                      StyleSheet.absoluteFillObject,
                      i == this.state.currentIndex
                        ? {
                            transform: [
                              { translateX: this.translateX },
                              { translateY: this.translateY },
                              { rotateZ }
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
    marginTop: 40
  }
});
