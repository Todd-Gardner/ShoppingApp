import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

import CartItem from "./CartItem";
import Colors from "../../constants/Colors";

const OrderItem = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  // Alternate ways other than using && in the return to show details
  /* if (showDetails) {
    const details = <View>DETAILS</View>;
  } //then {details} in the return
  // or inline in the return
  {
    showDetails ? <View>DETAILS</View> : "";
  } */

  return (
    <View style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.date}>{props.date}</Text>
        <Text style={styles.totalAmount}>${props.totalAmount.toFixed(2)}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={showDetails ? "Hide Details" : "Show Details"}
        onPress={() => {
          setShowDetails((previousState) => !previousState); //toggle true/false
        }}
      />
      {showDetails && (
        <View style={styles.orderDetails}>
          {props.items.map((cartItem) => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              title={cartItem.productTitle}
              price={cartItem.sum}
            />
          ))}
          <Text>add images?</Text>
        </View>
      )}
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
  orderDetails: {
    width: "100%",
  },
});

export default OrderItem;
