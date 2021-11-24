## CHAT APP ##

This Chat App is developed using React Native and Expo. The data will be stored in Google's Firestore [How to set up Firebase for your Javascript project](https://firebase.google.com/docs/web/setup).
I will be using the Gifted Chat React Native library. The Chat App will allow users to send not only text messages, but also messages that contain images. They will also be able to share their location with others.
React Native is a React framework for building Android and iOS apps that requires only one codebase instead of multiple for Android (Java/Kotlin) or iOS apps (Swift).

## Features:
- Users can navigate between Home Screen and Chat Screen
- Users can choose a background color for their chat screen from a selection of colors
- Users can choose a Username, that will displayed to them in the navigation header
- Users can send messages of text and images (taken by phone's camera or from phone's library) and share a map of their location 
- Users can read all the sent messages, even when offline (but cannot write and send new ones)

### Platform used during Development: 
- Android 11.0
- React (version 17.0.1)
- React Native (version ^0.64.3)
- Nodejs (version 16.13.0)
- react-native-gifted-chat (version ^0.16.3)
(more see in package.json file)

### Used Developement Evironment:
- Expo Cli (global)
- Android Studio:
- Android Emulator
- Android 11.0 (R)
- Android SDK Platform-Tools
- Intel x86 Emulator Accelerator (HAXM installer) or Android Emulator Hypervisor Driver for AMD Processors (Installer)

### Libraries (to install all dependencies all at once, use "npm install" when in the root folder of this project):
•	React
•	React-Dom
•	React-Native
•	React-Native-Gifted-Chat
•	React-Native-Maps
•	React-Navigation
•	Firebase
•	React-Native-Screens
•	React-Native-Safe-Area-Context
•	React-Native-Gesture-Handler
•	React-Native-Reanimated
•	React-Native-Web
•	React-Native-Async-Storage/async-storage
•	React-Native-Community/masked-view
•	React-Native-Community/netinfo
•   expo-image-picker
•	expo-location
•	expo-permissions

Getting started:
1.	In your terminal: go to the project folder (root folder) and run “npm install” (or “yarn install”) to install all necessary packages from the package.json file and their corresponding versions.
2.	To launch the metro bundler, run “start expo” and the metro bundler will open in a browser window or tab, where you can copy the QR code with your camera (iOS) or the Expo Go App (Android). You find the Expo Go App on the Google Play Store.
3.	If you want to run the App on an Emulator, launch the Emulator first, then type “i” (iOS) or “a” (Android) to launch Expo in your chosen Emulator. You don’t have to install the Expo App here.






