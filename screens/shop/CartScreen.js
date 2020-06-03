import React from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";

// TODO: Can also get the 'products' to display the image/title using useSelector
//and add to the display.
// Add a sort by price button ?

const CartScreen = (props) => {
  // Get grand total of the items (from redux store)
  const totalCartAmount = useSelector((state) => state.cart.totalAmount);
  // Get list of items added to cart
  const cartItems = useSelector((state) => {
    // Convert from object to array
    const cartItemsArray = [];
    for (const key in state.cart.items) {
      //new cartitem with an Id
      cartItemsArray.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    //returns an array, changing cartItems/ useSelector from obj to arr

    //sort to keep same order when removing quantity from an item
    // works without terniary expression
    //*** Can also add a button to sort by price ***
    return cartItemsArray.sort((a, b) => (a.productId > b.productId ? 1 : -1));
  });
  const dispatch = useDispatch();

  return (
    <View style={styles.screen}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem //or use productPrice for price
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            price={itemData.item.sum}
            deletable //sets to true to show delete button
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.summaryAmount}>
            ${totalCartAmount.toFixed(2)}
          </Text>
        </Text>
        <Button
          color={Colors.accent}
          title="Order Now"
          disabled={cartItems.length === 0} //disabled if empty
          onPress={() => {
            // Dispatch addOrder from both cart and orders reducers
            dispatch(ordersActions.addOrder(cartItems, totalCartAmount));
          }}
        />
      </View>
    </View>
  );
};

// Additional Navigation Options for the page
CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    padding: 10,
    //shadow for iOS - Card like
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    //
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  //can add the rest from ProductItem so have mini pics etc
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  summaryAmount: {
    color: Colors.primary,
  },
});

export default CartScreen;
