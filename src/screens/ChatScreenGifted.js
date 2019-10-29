import React from "react";
import { GiftedChat } from "react-native-gifted-chat"; // 0.3.0
import firebaseSDK from "../services/Firebase";

//import firebaseSDK from '../config/firebaseSDK';

export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || "Chat!"
  });

  constructor(props) {
    super();
    this.state = {
      messages: []
    };

    firebaseSDK.setRecipient(props.navigation.state.params.id);
  }

  get user() {
    const user = firebaseSDK.loggedInUserProfile;
    console.log(user);
    return {
      name: user.name,
      avatar: user.profile_picture,
      id: firebaseSDK.getLoggedInUserId(),
      _id: firebaseSDK.getLoggedInUserId()
    };
  }

  render() {
    //console.log(this.state.messages);
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={firebaseSDK.sendMessage}
        user={this.user}
      />
    );
  }

  componentDidMount() {
    firebaseSDK.getChatMessages(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message)
      }))
    );
  }
  componentWillUnmount() {
    firebaseSDK.chatRefOff();
  }
}
