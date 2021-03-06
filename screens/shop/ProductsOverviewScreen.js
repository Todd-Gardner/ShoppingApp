import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux"; //to tap into the redux store to get products
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart"; //import all actions
import * as productActions from "../../store/actions/products";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

// Moved Button(s) from ProductItem to here so ProductItem can be used elseware w/out same Button(s)

const ProductsOverviewScreen = (props) => {
  const [isloading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  // loadProducts will run every time you go to or back to the page
  const loadProducts = useCallback(async () => {
    setError(null); //reset error
    //setIsLoading(true); //screen still loading //removed for pull refresh
    setIsRefreshing(true); //this instead
    try {
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      //catch from child action (Products)
      setError(err.message);
    }
    setIsRefreshing(false);
    //setIsLoading(false); //finished loading when returns //removed for pull refresh
  }, [dispatch, setIsLoading, setError]); //not needed (will never change) //setIsRefreshing

  //---*** Listen to changes to the database - ('didFocus', willBlur, didBlur) ***---
  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProducts //callback function
    );
    // Cleanup Function - Remove listener when destroyed or about to be rerun
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]); //addListener is also a depend. but could cause infinate loop if passing prams etc

  // Get products from DB whenever the screen loads
  useEffect(() => {
    setIsLoading(true); //moved here for pull refresh
    loadProducts().then(() => {
      setIsLoading(false); //moved here for pull refresh
    });
  }, [dispatch, loadProducts]); //setIsLoading?

  // Button logic - not using props for onPress anymore (onViewDetails)
  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetails", {
      //send these props when navigating
      productId: id, //itemData.item.id,
      productTitle: title, //itemData.item.title,
    });
  };

  // Error message from Products action
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Uh oh! {error}</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  // Display spinner while loading products from the DB
  if (isloading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isloading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>We didn't find any products in the database!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts} //when user pulls down
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
          /*  onViewDetails={() => { }}
          onAddToCart={() => {
            dispatch(CartActions.addToCart(itemData.item)); //call function w/ item
            // before adding dispatch - props.navigation.navigate("Cart");
          }} */
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="Add to Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item)); //call function w/ item
              // before adding dispatch - props.navigation.navigate("Cart");
            }}
          />
        </ProductItem>
      )}
    />
  ); //keyExtractor for older versions
};

// Static header title (was 'ProductsOverview')
ProductsOverviewScreen.navigationOptions = (navData) => {
  //need to add navData =>{return{...}} to access navigation props dynamically
  return {
    headerTitle: "All Products",
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProductsOverviewScreen;
