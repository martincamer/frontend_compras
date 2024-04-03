import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { ImprirmirProductosPDF } from "../../../components/pdf/ImprirmirProductosPDF";
import client from "../../../api/axios";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const ViewPdfProducto = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await client.get("/ordenes");

      setDatos(res.data);
    }

    loadData();
  }, []);

  const filteredProducts = datos.flatMap((orden) =>
    orden.datos.productoSeleccionado.map((producto) => ({
      ...producto,
      proveedor: orden.proveedor, // Agregar la información del proveedor al producto
    }))
  );

  console.log(filteredProducts);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <ImprirmirProductosPDF datos={filteredProducts} />
    </PDFViewer>
  );
};
