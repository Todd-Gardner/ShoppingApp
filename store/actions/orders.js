// Action Identifiers
export const ADD_ORDER = "ADD_ORDER";

// Action Creator Functions
export const addOrder = (cartItems, totalAmount) => {
  return {
    type: ADD_ORDER,
    //can split up into 2+ different properties
    orderData: { items: cartItems, amount: totalAmount },
  }; //returns action object
};
