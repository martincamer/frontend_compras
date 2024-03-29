import axios from "./axios";

export const crearNuevoProducto = (data) => axios.get("/productos", data);

export const crearOrden = (data) => axios.get("/crear-orden-nueva", data);

export const obtenerProductos = () => axios.get("/productos");

export const obtenerOrdenes = () => axios.get("/ordenes");

export const obtenerOrdenesMensuales = () => axios.get("/ordenes-mensuales");
