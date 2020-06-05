import PRODUCTS from "../../data/dummy-data"; //use the fake data
import { REMOVE_PRODUCT } from "../actions/products";

// initial state is all of the products, plus the products filtered by user
const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((prod) => prod.ownerId === "u1"),
};

// becomes productReducer -> products
export default (state = initialState, action) => {
  switch (action.type) {
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
  }
  return state;
};
