import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import CartItem from "./CartItem";
import Colors from "../../constants/Colors";

const OrderItem = (props) => {
  return (
    <View style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.date}>{props.date}</Text>
        <Text style={styles.totalAmount}>${props.totalAmount.toFixed(2)}</Text>
      </View>
      <Button color={Colors.primary} title="Show Details" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    //Card look from ProductItems
    //Shadow for iOS - Card like
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    //Android
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
    margin: 20,
    padding: 10,
    alignItems: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888",
  },
  totalAmount: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
});

export default OrderItem;
