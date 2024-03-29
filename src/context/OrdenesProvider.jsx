//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerOrdenesMensuales } from "../api/apis";

//context
export const OrdenesContext = createContext();

//use context
export const useOrdenesContext = () => {
  const context = useContext(OrdenesContext);
  if (!context) {
    throw new Error("Use Ordenes Propvider");
  }
  return context;
};

//
export const OrdenesProvider = ({ children }) => {
  const [ordenesMensuales, setOrdenesMensuales] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerOrdenesMensuales();
      setOrdenesMensuales(respuesta.data);
    }

    loadData();
  }, []);

  console.log(ordenesMensuales);

  return (
    <OrdenesContext.Provider
      value={{
        ordenesMensuales,
        setOrdenesMensuales,
      }}
    >
      {children}
    </OrdenesContext.Provider>
  );
};
