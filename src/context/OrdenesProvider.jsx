//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerOrdenesMensuales } from "../api/apis";
import client from "../api/axios";

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
  const [ordenesFinalMensuales, setOrdenesFinalMensuales] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerOrdenesMensuales();
      setOrdenesMensuales(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/ordenes-dos-mensual");
      setOrdenesFinalMensuales(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const res = await client.get("/ordenes");

      setOrdenes(res.data);
    }

    loadData();
  }, []);

  return (
    <OrdenesContext.Provider
      value={{
        ordenesMensuales,
        setOrdenesMensuales,
        setOrdenesFinalMensuales,
        ordenesFinalMensuales,
        ordenes,
      }}
    >
      {children}
    </OrdenesContext.Provider>
  );
};
