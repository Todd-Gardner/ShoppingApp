import React from "react";
import { FlatList, Button, Platform, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import * as productsActions from "../../store/actions/products";

// TODO: CATCH and display errors

const UserProductsScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();

  // Button logic - (editProductHandler) title???
  const editProductHandler = (id) => {
    props.navigation.navigate("EditProduct", {
      //send these props when navigating
      productId: id, //itemData.item.id,
    });
  };

  // Display Confirmation Alert when deleting a product
  const deleteHandler = (id, title) => {
    Alert.alert("Are you sure?", `${title} will be deleted!`, [
      { text: "No", style: "default" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          dispatch(productsActions.removeProduct(id));
        }, //call function w/ item };
      },
    ]);
  };

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price} //
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit Details"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete Item"
            onPress={deleteHandler.bind(
              this,
              itemData.item.id,
              itemData.item.title
            )}
            /* Either bind or:
            onPress={() => {
              deleteHandler(itemData.item.id, itemData.item.title);
            }} */
          />
        </ProductItem>
      )}
    />
  );
};

// Custom Header for page (was UserProducts)
UserProductsScreen.navigationOptions = (navData) => {
  //need to add navData =>{return{...}} to access navigation props dynamically
  return {
    headerTitle: "Your Products", //static
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
          title="Add"
          iconName={Platform.OS === "android" ? "md-add" : "ios-add"} //create
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default UserProductsScreen;
