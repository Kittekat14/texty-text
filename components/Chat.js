import React from "react";
import { KeyboardAvoidingView, View, Platform } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    //get textInput from Start.js and display it in Header
    let text = this.props.route.params.text;
    this.props.navigation.setOptions({ title: text });

    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: "You entered the chatroom.",
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    let text = this.props.route.params.text;
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: text });

    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
            name: text
          }}
        />
        {/* If the platform’s OS is Android, add the component KeyboardAvoidingView; else, insert nothing */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
