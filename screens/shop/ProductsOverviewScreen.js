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
  const [error, setError] = useState();
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null); //reset error
    setIsLoading(true); //screen still loading
    try {
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      //catch from child action (Products)
      setError(err.message);
    }
    setIsLoading(false); //finished loading when returns
  }, [dispatch, setIsLoading, setError]); //not needed (will never change)

  // Get products from DB whenever the screen loads
  useEffect(() => {
    loadProducts();
  }, [dispatch, loadProducts]);

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
