import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

import { Like } from "../../../Components/Icons";
import { SPACING } from "../../../Constants";

export default function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Like style={styles.iconStyle} />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Write a comment..."
          style={styles.textInputStyle}
          placeholderTextColor="grey"
          onChange={() => true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: SPACING * 6,
    alignItems: "center",
    padding: SPACING,
    borderTopColor: "#efefef",
    borderTopWidth: 1,
    backgroundColor: "#FFF",
    zIndex: 11,
  },
  iconWrapper: {
    flex: 10,
  },
  iconStyle: {
    height: SPACING * 2,
    width: SPACING * 2,
    padding: SPACING,
  },
  inputWrapper: {
    flex: 90,
    backgroundColor: "#a7a4a490",
    justifyContent: "center",
    borderRadius: SPACING * 2,
    //margin: SPACING / 2,
    paddingHorizontal: SPACING,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 15,
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
});
