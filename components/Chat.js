import React from "react";
const firebase = require('firebase');
require('firebase/firestore');

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { KeyboardAvoidingView, View, Platform } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAVl8wJ9Xy9PkAQjvY72ah1JD6ISfuT_bA",
      authDomain: "lessenger-d5b80.firebaseapp.com",
      projectId: "lessenger-d5b80",
      storageBucket: "lessenger-d5b80.appspot.com",
      messagingSenderId: "475201686420",
      appId: "1:475201686420:web:86ff783a4735c6ec46dd81",
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // reference a collection my database
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    let text = this.props.route.params.text;
    this.props.navigation.setOptions({ title: text });
    this.referenceMessages = firebase.firestore().collection("messages");
    this.unsubscribe = this.referenceMessages.onSnapshot(
      this.onCollectionUpdate
    );
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar:
              "https://wi.wallpapertip.com/wsimgs/30-308464_cool-profile-pictures-1080p.jpg",
          },
        },
        {
          _id: 2,
          text: `${this.props.route.params.text} has entered the chatroom.`,
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };
  
  addMessages() {
    this.referenceMessages.add({
      _id: 3,
      text: "random text",
      createdAt: new Date(),
      user: "newUser",
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.addMessages;
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#32a8cc",
          },
          left: {
            backgroundColor: "#42f5bc",
            marginLeft: 0,
          },
        }}
      />
    );
  }

  render() {
    //get textInput from Start.js and display it in Header
    let text = this.props.route.params.text;
    this.props.navigation.setOptions({ title: text });
    let color = this.props.route.params.color;

    return (
      <View style={{ flex: 1, backgroundColor: color, color: "#000" }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
            name: text,
            avatar:
              "https://p0.pikist.com/photos/357/246/kitten-cat-baby-small-baby-cat-cute-sweet-pet-domestic-cat-cat.jpg",
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
