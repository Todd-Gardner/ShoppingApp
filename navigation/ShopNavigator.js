import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { Platform } from "react-native";

import ProductOverViewScreen from "../screens/shop/ProductsOverviewScreen";
import Colors from "../constants/Colors";

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductOverViewScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : "",
      },
      headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
    },
  }
);

export default createAppContainer(ProductsNavigator);
