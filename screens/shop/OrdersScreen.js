import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as orderActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";

//only need to output list of orders, so no need for styling etc
const OrderScreen = (props) => {
  const [isloading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  // get orders slice from store/redux
  const orders = useSelector((state) => state.orders.orders);

  const dispatch = useDispatch();

  // Helper function
  // loadOrders will run every time you go to or back to the page
  const loadOrders = useCallback(async () => {
    setError(null); //reset error
    setIsRefreshing(true);
    try {
      await dispatch(orderActions.fetchOrders());
    } catch (err) {
      //catch from child action (orders)
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsRefreshing, setError]); //setIsLoading

  // Get orders from DB whenever the screen loads
  useEffect(() => {
    //dont use async for anon. Can use helper function or use .then
    setIsLoading(true);
    loadOrders().then(() => {
      setIsLoading(false);
    }); //.catch
  }, [dispatch, loadOrders]);

  /* In catch? - To display Alert, not a page
  // Hook to receive Errors from orders actions
  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Ok, Thank You" }]);
    }
  }, [error]); */

  // Error message from the Orders action
  // Use this if you want an error page after the Error & not go straight back to page
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>ERROR: {error}</Text>
        <Button
          title="try again"
          onPress={loadOrders} //---need to reload/retry fetch
          color={Colors.primary}
        />
      </View>
    );
  }

  // Display Activity Spinner if still Loading
  if (isloading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Display message if user doesn't have any products
  if (orders.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>You don't have any orders. Time to start ordering!</Text>
      </View>
    );
  }

  // keyExtractor only for older versions.
  // renderItem holds a function that gets the itemData and render what we want (per order)
  return (
    <FlatList
      onRefresh={loadOrders}
      refreshing={isRefreshing}
      data={orders}
      keyExtractor={(item) => item.id} //change to key??
      renderItem={(itemData) => (
        <OrderItem
          date={itemData.item.readableDate}
          totalAmount={itemData.item.totalAmount}
          items={itemData.item.items}
        />
      )}
    />
  );
};

// Additional Navigation Options for the page
OrderScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1, //*need*
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderScreen;
