import React from "react";
import firebase from "firebase";
import "firebase/firestore";

import { KeyboardAvoidingView, View, Platform } from "react-native";
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Alert
} from "react-native-gifted-chat";
import MapView from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import CustomActions from './CustomActions';

//getting rid of some warnings because of LogBox
import { YellowBox, LogBox } from "react-native";
import _ from "lodash";
import { CurrentRenderContext } from "@react-navigation/native";


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
      image: null,
      location: null,
    };

    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    // reference to messages collection in the constructor of my class component
    this.referenceMessages = firebase.firestore().collection("messages");
    this.referenceMessagesUsers = null;

    // Ignore warnings
    // YellowBox.ignoreWarnings(["Setting a timer"]);
    // const _console = _.clone(console);
    // console.warn = (message) => {
    //   if (message.indexOf("Setting a timer") <= -1) {
    //     _console.warn(message);
    //   }
    // };
    // Ignore log notification by message
    // LogBox.ignoreLogs([
    //   "Setting a timer",
    //   "Warning: ...",
    //   "undefined",
    //   "Animated.event now requires a second argument for options",
    // ]);

    LogBox.ignoreAllLogs(); //Ignore all log notifications
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
    //get name from start screen and change title of page to user's name
    let text = this.props.route.params.text;
    //get the name from the home screen and change the title of the page to the name of the user
    this.props.navigation.setOptions({ title: text });
    // To Check user connection
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");

        // Referencing to load messages via Firebase
        this.referenceMessages = firebase.firestore().collection("messages");

        // Listen to authentication events
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            // Adding user to state
            this.setState({
              uid: user.uid,
              user: {
                _id: user.uid,
                name: this.props.route.params.text,
                avatar: "https://placeimg.com/140/140/any",
              },
              messages: [],
            });

            //add messages to user
            this.referenceMessagesUsers = firebase
              .firestore()
              .collection("messages")
              .where("uid", "==", this.state.uid);

            // Listening for collection changes for current user
            this.unsubscribe = this.referenceMessages
              // .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      //saving messages locally to asyncStorage
        this.saveMessages();
      } else {
        this.setState({ isConnected: false });
        //obtaining messages from asyncStorage
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Goes through each document
    querySnapshot.forEach((doc) => {
      // Gets the QueryDocumentSnapshot's data
      var data = doc.data();
        messages.push({
          _id: data._id,
          text: data.text || "",
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar,
          },
          image: data.image || null,
          location: data.location || null,
        });
    });

    this.setState({
      messages,
    });
  };

  // Sends the written text to the chat screen
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || "",
      user: message.user,
      image: message.image || "",
      location: message.location || null,
    });
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
          isConnected={this.state.isConnected}
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.user.name,
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


