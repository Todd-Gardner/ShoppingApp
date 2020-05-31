import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// TODO: Add image of the item

const CartItem = (props) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity} </Text>
        <Text style={styles.itemText}>{props.title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.itemText}>${props.price.toFixed(2)}</Text>
        <TouchableOpacity style={styles.removeButton} onPress={props.onRemove}>
          <Ionicons
            name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
            size={23}
            color="red"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    //maybe give it a card look
    flexDirection: "row",
    justifyContent: "space-between", //evenly so no padding needed
    //padding: 10,
    marginHorizontal: 20,
    backgroundColor: "white",
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "open-sans",
    color: "#888",
    fontSize: 16,
  },
  itemText: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  removeButton: {
    margin: 20,
  },
});

export default CartItem;
