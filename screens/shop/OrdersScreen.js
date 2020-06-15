import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
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

// TODO: ***ADD Error handling***

//only need to output list of orders, so no need for styling etc
const OrderScreen = (props) => {
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // get orders slice from store/redux
  const orders = useSelector((state) => state.orders.orders);

  const dispatch = useDispatch();
  useEffect(() => {
    //dont use async for anon. Can use helper function or use .then
    setIsLoading(true);
    dispatch(orderActions.fetchOrders()).then(() => {
      setIsLoading(false);
    }); //.catch
  }, [dispatch]);

  /* ***Either helper w/ try/catch or .catch above ***

  // Hook to receive Errors from products actions
  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Ok, Thank You" }]);
    }
  }, [error]); */

  ////////////////////////////////////////////////////////
  // Error message from the Orders action
  // Use this if you want an error page after the Alert & not go straight back to page
  /* if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>ERROR: {error}</Text>
        <Button
          title="try again"
          onPress={setError(null)}
          color={Colors.primary}
        />
      </View>
    );
  } */

  // Display Activity Spinner if still Loading
  if (isloading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // keyExtractor only for older versions.
  // renderItem holds a function that gets the itemData and render what we want (per order)
  return (
    <FlatList
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
