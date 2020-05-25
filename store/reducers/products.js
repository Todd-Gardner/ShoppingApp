import PRODUCTS from "../../data/dummy-data"; //use the fake data

// initial state is all of the products, plus the products filtered by user
const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((prod) => prod.ownerId === "u1"),
};

// becomes productReducer -> products
export default (state = initialState, action) => {
  return state;
};
