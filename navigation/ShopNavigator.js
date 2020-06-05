import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ProductOverViewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import Colors from "../constants/Colors";

// Default Navigation Options
const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTitleAlign: "center", //maybe remove to keep native look
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

// Products Navigation Stack
const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductOverViewScreen, //can use for static header
    ProductDetails: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    navigationOptions: {
      //double check with Nav. version
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor} //drawer highlights where you are
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

// Create another StackNavigator for Orders so it has a Header
const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    navigationOptions: {
      //double check with Nav. version
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor} //drawer highlights where you are
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

// Create another StackNavigator for Admin section
const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen,
  },
  {
    navigationOptions: {
      //double check with Nav. version
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-pricetag"} //create
          size={23}
          color={drawerConfig.tintColor} //drawer highlights where you are
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

// Drawer Navigation
const ShopNavigator = createDrawerNavigator(
  {
    // Merdge the Products and Orders Navigation Stacks together
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    //Set Options for drawer content
    contentOptions: {
      activeTintColor: Colors.primary, //check navigation ver. for compat
    },
  }
);

export default createAppContainer(ShopNavigator);
