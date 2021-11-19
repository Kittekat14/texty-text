import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Pressable, View, Text, StyleSheet } from 'react-native';
import firebase from "firebase";
import firestore from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Camera } from "expo-camera";


export default class CustomActions extends Component {
  // Lets the user pick an image from the device's image library
  pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    try {
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          this.setState({
            image: result,
          });
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.addMessage({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Lets the user take a photo with device's camera
  takePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();

    try {
      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync().catch((error) =>
          console.log(error)
        );

        if (!result.cancelled) {
          this.setState({
            image: result,
          });
          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.addMessage({ image: imageUrl });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Get the location of the user by using GPS
  getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    //Permissions.askAsync(Permissions.LOCATION); ->deprecated
    try {
      if (status === "granted") {
        const result = await Location.getCurrentPositionAsync({}).catch(
          (error) => console.log(error)
        );
        const longitude = JSON.stringify(location.coords.longitude);
        const latitude = JSON.stringify(location.coords.latitude);
        if (result) {
          this.props.addMessage({
            location: {
              longitude: longitude,
              latitude: latitude,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take a Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log("user wants to pick an image");
            return this.pickImage();
          case 1:
            console.log("user wants to take a photo");
            return this.takePhoto();
          case 2:
            console.log("user wants to get their location");
            return this.getLocation();
          default:
        }
      }
    );
  };

  // Upload the images to firebase
  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    const snapshot = await ref.put(blob);
    blob.close();
    return await snapshot.ref.getDownloadURL();
  };

  render() {
    return (
      <View>
        <Pressable
          onPress={this.onActionPress}
          style={[styles.container]}
          accessible={true}
          accessibilityLabel="Button that shows action options"
          accessibilityHint="Users can send an image or their geolocation"
          accessibilityRole="button"
        >
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
          </View>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#5b5b5b",
    borderWidth: 1,
    flex: 1,
  },
  iconText: {
    color: "#5b5b5b",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

