import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

// Presentational Component - Card like
const Card = (props) => {
  // The View will wrap whatever we pass in between the tags
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

// styles will merdge with the props passed in
const styles = StyleSheet.create({
  card: {
    //shadow for iOS - Card like
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    //Android
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default Card;
