import PRODUCTS from "../../data/dummy-data"; //use the fake data
import {
  REMOVE_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRODUCTS,
} from "../actions/products";
import Product from "../../models/product";

// initial state is all of the products, plus the products filtered by user
const initialState = {
  availableProducts: [], //PRODUCTS,
  userProducts: [], //PRODUCTS.filter((prod) => prod.ownerId === "u1"),
};

// becomes productReducer -> products
export default (state = initialState, action) => {
  switch (action.type) {
    // Get product from DB on load
    case GET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
      };
    case REMOVE_PRODUCT:
      //get the product, return the product(s) that dont match the action product Id
      return {
        ...state,
        //filter runs function on all and then returns new array of true items
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.pId
        ),
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pId
        ),
      };
    case ADD_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId, //"u1", //hardcoded until we have real users
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        // Create a new array with the new elements added
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      // Loop through array to find matching index/pId
      const productIndex = state.userProducts.findIndex(
        (product) => product.id === action.pId
      );
      // New Product, but pre-populated with pId, ownerId and price (wont/cant change)
      // Get pId from action, use state for productIndex to get the ownerId
      // Store the new title, imageUrl and description
      const updatedProduct = new Product(
        action.pId,
        state.userProducts[productIndex].ownerId, //pre-populated
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price //and not editable
      );
      // Update the state
      const updatedUserProducts = [...state.userProducts]; //create copy of existing products
      // Replace the product at the index w/ the updatedProduct (Not the original array)
      updatedUserProducts[productIndex] = updatedProduct;

      // Repeat to update availableProducts
      // Find matching index / pID
      const availableProductIndex = state.availableProducts.findIndex(
        (product) => product.id === action.pId
      );
      const updatedAvailableProducts = [...state.availableProducts]; //create copy of existing
      // Replace existing product with the updated arrays
      updatedAvailableProducts[availableProductIndex] = updatedProduct;

      return {
        ...state,
        userProducts: updatedUserProducts,
        availableProducts: updatedAvailableProducts,
      };
  }
  return state;
};
