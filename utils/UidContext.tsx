import React, { useContext } from "react";

const UidContext = React.createContext(null);

export const Provider = ({ children, value }) => <UidContext.Provider value={value}>{children}</UidContext.Provider>;
export const useUid = () => useContext(UidContext);
