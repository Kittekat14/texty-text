import React from "react";

import firebase from "firebase";
import "firebase/firestore";

import { KeyboardAvoidingView, View, Text, Icon, Platform, TouchableOpacity } from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  SystemMessage,
} from "react-native-gifted-chat";
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import CustomActions from './CustomActions';

import { YellowBox } from "react-native";
import _ from "lodash";
import { CurrentRenderContext } from "@react-navigation/native";

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
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
      isConnected: false,
      image: "",
      location: {},
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // reference to messages collection in the constructor of my class component
    this.referenceMessages = firebase.firestore().collection("messages");
    this.referenceMessageUser = null;
  }

  //gets messages from AsyncStorage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  //saves messages in AsyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  //deletes messages from AsyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    this.getMessages();
    let text = this.props.route.params.text;
    this.props.navigation.setOptions({ title: text });

    // check if user is online or offline
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("ONLINE");
        //listen to authentication:
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
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

            this.saveMessages();
            // reference to messages collection in firebase
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        console.log("OFFLINE");
        this.setState({ isConnected: false });
        this.getMessages(); // read messages is still possible if offline
      }
    });

    // const systemMsg = {
    //   _id: `system- ${Math.floor(Math.random() * 100000)}`,
    //   text: `${text ? text : "Anonymous"} joined the conversation 👋`,
    //   createdAt: new Date(),
    //   user: {
    //     name: text},
    //   system: true,
    // };
    // this.referenceMessages.add(systemMsg);
  }

  componentWillUnmount() {
    //const { text } = this.props.route.params;
    // stop listening to authentication and collection updates
    this.unsubscribe();
    this.authUnsubscribe();

    // const systemMsg = {
    //   _id: `system-${Math.floor(Math.random() * 100000)}`,
    //   text: `${text ? text : "Anonymous"} left the conversation 👋`,
    //   createdAt: new Date(),
    //   user: {
    //     name: text},
    //   system: true,
    // };
    // this.referenceMessages.add(systemMsg);
  }

  //adding and retrieving messages from/to collection
  // Comes from the database
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: data.user.name,
        image: data.image || "",
        location: data.location || null,
      });
    });
    this.setState({
      messages: messages,
    });
  };

  // Comes from my side
  addMessage() {
    const message = this.state.messages[0]; //adding the currently sent message
    // add the new messages to the collection reference and to firebase
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || "",
      location: message.location || null,
    });
  }

  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  };

  renderSystemMsg(props) {
    return (
      <SystemMessage
        {...props}
        textStyle={{ color: "grey", fontSize: 14 }}
        wrapperStyle={{
          borderWidth: 1,
          borderColor: "grey",
          flex: "60%",
          alignItems: "center",
        }}
      />
    );
  }
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
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

  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    //get textInput from Start.js and display it in Header
    let text = this.props.route.params.text;
    //this.props.navigation.setOptions({ title: text });
    let color = this.props.route.params.color;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: color,
          color: "#000",
        }}
      >
        <GiftedChat
          style={{ width: 100, height: 20 }}
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          renderSystemMessage={this.renderSystemMsg}
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


