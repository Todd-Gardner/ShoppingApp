import { ADD_ORDER } from "../actions/orders";
import Order from "../../models/order";

// State slice of the orders
const initialState = {
  orders: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      //   using Date as 'dummy' id until get from a DB
      const newOrder = new Order(
        new Date().toString(), //.toDateString()
        action.orderData.items,
        action.orderData.amount,
        new Date()
      );
      return {
        //...state not needed unless something is added that isn't updated below
        ...state,
        orders: state.orders.concat(newOrder), //original array not modified
      };
  }

  return state;
};
