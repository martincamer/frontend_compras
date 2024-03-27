import axios from "./axios";

export const crearNuevoProducto = (data) => axios.get("/productos", data);

export const obtenerProductos = () => axios.get("/productos");

export const obtenerOrdenes = () => axios.get("/ordenes");
