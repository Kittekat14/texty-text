import React from "react";
import firebase from "firebase";
import "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { KeyboardAvoidingView, View, Platform } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVl8wJ9Xy9PkAQjvY72ah1JD6ISfuT_bA",
  authDomain: "lessenger-d5b80.firebaseapp.com",
  projectId: "lessenger-d5b80",
  storageBucket: "lessenger-d5b80.appspot.com",
  messagingSenderId: "475201686420",
  appId: "1:475201686420:web:86ff783a4735c6ec46dd81",
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: 0,
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // reference to messages collection in the constructor of my class component
    this.referenceMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    let text = this.props.route.params.text;
    this.props.navigation.setOptions({ title: text });

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        user: {
          _id: user.uid,
          name: text,
          avatar: "https://placeimg.com/140/140/any",
        },
        messages: [],
      });

      // reference to messages collection
      this.unsubscribeChatUser = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // stop listening to authentication and collection updates
    this.authUnsubscribe();
    this.unsubscribeChatUser();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the querysnapshot's data
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

  addMessage() {
    const message = this.state.messages[0];//adding the currently sent message
    // add the new messages to the collection reference and to firebase
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
      }
    );
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
            _id: this.state.uid,
            name: this.props.route.params.text,
            avatar: "https://placeimg.com/140/140/any",
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
