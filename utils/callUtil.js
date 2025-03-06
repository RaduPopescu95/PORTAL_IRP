import { Text, TouchableOpacity, Linking } from "react-native";

export const makeCall = (number) => {
  console.log("Attempting to make a call:");
  Linking.openURL(`tel:${number}`);
};
