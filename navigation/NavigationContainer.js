import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";

import ShopNavigator from "./ShopNavigator";

// A wrapper for the ShopNavigator so we can access it for the timer

const NavigationContainer = (props) => {
  //useRef hook to get access to navigation in the JSX / ShopNavigator component
  const navRef = useRef();
  //tap into the store. Double bang to return true/false if token
  const isAuth = useSelector((state) => !!state.auth.token);

  // Watch for changes to isAuth/token
  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      ); //takes an object
    }
  }, [isAuth]);

  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;
