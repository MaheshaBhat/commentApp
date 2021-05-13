import React from "react";
import { ActionSheetContext } from "./ActionSheetContext";

export const ActionSheetProvider = ({ children, axis, scroll }) => {
  return (
    <ActionSheetContext.Provider value={{ scroll, axis }}>
      {children}
    </ActionSheetContext.Provider>
  );
};
