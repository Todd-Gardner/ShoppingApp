import React from "react";
import { FlatList, Button, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux"; //to tap into the redux store to get products
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as CartActions from "../../store/actions/cart"; //import all actions
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

// Moved Button(s) from ProductItem to here so ProductItem can be used elseware w/out same Button(s)

const ProductsOverviewScreen = (props) => {
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  // Button logic - not using props for onPress anymore (onViewDetails)
  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetails", {
      //send these props when navigating
      productId: id, //itemData.item.id,
      productTitle: title, //itemData.item.title,
    });
  };

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
              dispatch(CartActions.addToCart(itemData.item)); //call function w/ item
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

export default ProductsOverviewScreen;
