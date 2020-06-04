import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Image,
  StyleSheet,
  Platform,
} from "react-native";

// Presentational Component

// Replaced Button(s) components with {props.children} so Buttons can be customized per screen
const ProductItem = (props) => {
  let TouchableCmpt = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version > 20) {
    TouchableCmpt = TouchableNativeFeedback;
  }

  return (
    <View style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmpt onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            </View>
            <View style={styles.buttonContainer}>
              {props.children}
            </View>
          </View>
        </TouchableCmpt>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  product: {
    //shadow for iOS - Card like
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    //
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    height: 300,
    margin: 20,
    //overflow: "hidden",
  },
  //Added this and another View to fix android (child error)
  touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  //imageContainer to make all corners rounded
  //move w/h from image to here
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    alignItems: "center",
    height: "15%",
   // padding: 10,///removed to fix iOS title
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 2, //4 was getting cut off on iOS
  },
  price: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", //between
    alignItems: "center",
    height: "25%",
    //paddingHorizontal: 20, //if using between above
  },
});

export default ProductItem;
