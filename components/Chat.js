import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
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
      ],
    });
  }

  render() {
    let text = this.props.route.params.text;
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ title: text });
    //this.props.navigation.setOptions({ backgroundColor: color });

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: color,
        }}
      >
        {color === "#090C08" || color === "#474056" ? (
          <Text style={{ color: "white" }}>Hello Friends!</Text>
        ) : (
          <Text style={{ color: "#000" }}>Hello Friends!</Text>
        )}
      </View>
    );
  }
}
