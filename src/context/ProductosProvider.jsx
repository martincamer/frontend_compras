//imports
import { createContext, useContext, useEffect, useState } from "react";
import { obtenerProductos } from "../api/apis";
import client from "../api/axios";

//context
export const ProductosContext = createContext();

//use context
export const useProductosContext = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error("Use Productos Propvider");
  }
  return context;
};

//
export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    async function loadData() {
      const respuesta = await obtenerProductos();
      setProductos(respuesta.data);
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadData() {
      const respuesta = await client.get("/categorias");
      setCategorias(respuesta.data);
    }

    loadData();
  }, []);

  return (
    <ProductosContext.Provider
      value={{ productos, setProductos, categorias, setCategorias }}
    >
      {children}
    </ProductosContext.Provider>
  );
};
