import React, { Component } from 'react';
import PropTypes from "prop-types";
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import firebase from "firebase";
import firestore from "firebase";

export default class CustomActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      location: null,
    };
  }

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
  

  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
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
            // pickImage = async () => {
            //   const { status } = await Permissions.askAsync(
            //     Permissions.CAMERA_ROLL
            //   );

            //   if (status === "granted") {
            //     let result = await ImagePicker.launchImageLibraryAsync({
            //       mediaTypes: "Images",
            //     }).catch((error) => console.log(error));

            //     if (!result.cancelled) {
            //       setState({
            //         image: result,
            //       });
            //     }
            //   }
            // };
            return;
          case 1:
            console.log("user wants to take a photo");
            // takePhoto = async () => {
            //   const { status } = await Permissions.askAsync(
            //     Permissions.CAMERA_ROLL,
            //     Permissions.CAMERA
            //   );
            //   if (status === "granted") {
            //     let result = await ImagePicker.launchCameraAsync().catch(
            //       (error) => console.log(error)
            //     );
            //     if (!result.cancelled) {
            //       setState({
            //         image: result,
            //       });
            //     }
            //   }
            // };
            return;
          case 2:
            console.log("user wants to get their location");
            // getLocation = async () => {
            //   const { status } = await Permissions.askAsync(
            //     Permissions.LOCATION
            //   );
            //   if (status === "granted") {
            //     let result = await Location.getCurrentPositionAsync({});
            //     if (result) {
            //       setState({
            //         location: result,
            //       });
            //     }
            //   }
            // };
          default:
            console.log("this is default case");
        }
      }
    );
  };

  render() {
    return (
      <div>
        <TouchableHighlight
          onPress={this.onActionPress}
          style={[styles.container]}
          underlayColor="white"
        >
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
          </View>
        </TouchableHighlight>
      </div>
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
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#b2b2b2",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

