import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import {
  createDrawerNavigator,
  DrawerItems,
  DrawerNavigatorItems,
} from "react-navigation-drawer";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Platform, SafeAreaView, View, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import ProductOverViewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import StartScreen from "../screens/StartScreen";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

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
          name={Platform.OS === "android" ? "md-pricetags" : "ios-pricetags"} //cart
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
          name={Platform.OS === "android" ? "md-create" : "ios-create"} //create
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
    // Merge the Products, Orders and Admin Navigation Stacks together (Route config map)
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    // Set Options for drawer content
    contentOptions: {
      activeTintColor: Colors.primary, //check navigation ver. for compat
    },
    // Create logout button in drawer (Can be in own component file)
    //<DrawerNavigatorItems>
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
                //props.navigation.navigate('Auth'); - NavigationContainer does thhis for us now
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

// Create Auth Navigation Stack
const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

// Switch Navigation for Login - It all starts here -
const MainNavigator = createSwitchNavigator({
  Start: StartScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator);
