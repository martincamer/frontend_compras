//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerOrdenes } from "../api/ingresos";

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
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerOrdenes();
      setOrdenes(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <OrdenesContext.Provider
      value={{
        ordenes,
        setOrdenes,
      }}
    >
      {children}
    </OrdenesContext.Provider>
  );
};
