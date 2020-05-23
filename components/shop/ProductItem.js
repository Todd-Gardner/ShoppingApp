import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";

// Presentational Component
const ProductItem = (props) => {
  return (
    <View style={styles.product}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: props.image }} />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.price}>${props.price.toFixed(2)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={Colors.primary}
          title="View Details"
          onPress={props.onViewDetails}
        />
        <Button
          color={Colors.primary}
          title="Add to Cart"
          onPress={props.onAddToCart}
        />
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
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginVertical: 4,
  },
  price: {
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
