import Order from "../../models/order";

// Action Identifiers
export const ADD_ORDER = "ADD_ORDER";
export const GET_ORDERS = "GET_ORDERS";

// Action Creator Functions
export const fetchOrders = () => {
  return async (dispatch) => {
    try {
      const user = "u1";
      const response = await fetch(
        `https://rn-shopping-app-595e5.firebaseio.com/orders/${user}.jon`
      );
      // Check for 400/500 errors
      if (!response.ok) {
        throw new Error("Could not get orders from the database!");
      }

      const resData = await response.json();
      // console.log("resData: ", resData); //returns object w/ unique id '-M...'

      const savedOrders = [];
      // Map the keys from the object to array
      for (const key in resData) {
        savedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date) //convert the saved date string to Date object
          )
        );
      }

      dispatch({ type: "GET_ORDERS", orders: savedOrders });
    } catch (err) {
      console.log("ERROR getting orders", err);
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch) => {
    try {
      const user = "u1";
      const date = new Date();
      //creates the products folder in the DB
      const response = await fetch(
        `https://rn-shopping-app-595e5.firebaseio.com/orders/${user}.json`,
        {
          //firebase needs the .json
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          //turn our objects to json
          body: JSON.stringify({
            cartItems,
            totalAmount,
            date: date.toISOString(),
          }), //**change to create date on the server later **
        }
      ); //.then(Response => {...}) if no async/await;

      // Check for errors - throw to parent component
      if (!response.ok) {
        throw new Error("Could not add the order to the database!");
      }

      const resData = await response.json(); //move above error?
      // console.log("resData: ", resData);

      dispatch({
        type: ADD_ORDER,
        //can split up into 2+ different properties
        orderData: {
          id: resData.name,
          items: cartItems,
          amount: totalAmount,
          date: date,
        },
      }); //returns action object
    } catch (err) {
      console.log("ERROR: ", err);
      //can thow error to custom analytics server (Jira / Sentry)
      throw err; //throw to parent (ProductsOverviewScreen)
    }
  };
};
