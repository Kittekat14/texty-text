import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Chat extends React.Component {
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
