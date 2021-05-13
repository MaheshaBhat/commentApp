import React from "react";
import { StatusBar, SafeAreaView } from "react-native";

import Home from "./src/Screens/Home";

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <Home />
    </SafeAreaView>
  );
};

export default App;
