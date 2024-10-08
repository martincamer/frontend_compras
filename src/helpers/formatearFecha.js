export const formatearFecha = (fecha) =>
  new Date(fecha).toLocaleString("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const formatearMesAño = (fecha) =>
  new Date(fecha).toLocaleString("es-AR", {
    year: "numeric",
    month: "long", // Mes en letras (por ejemplo: octubre)
    day: "2-digit",
  });
