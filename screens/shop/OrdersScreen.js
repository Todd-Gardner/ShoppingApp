import React from "react";
import { FlatList, Text, Platform } from "react-native";
import { useSelector } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";

//only need to output list of orders, so no need for styling etc
const OrderScreen = (props) => {
  // get orders slice from store/redux
  const orders = useSelector((state) => state.orders.orders);

  // keyExtractor only for older versions.
  // renderItem holds a function that gets the itemData and render what we want (per order)
  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
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

export default OrderScreen;
