import { PDFViewer } from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ImprimirComprobante } from "../../../components/pdf/ImprirmirComprobante";
import client from "../../../api/axios";

// import { ImprimirPdf } from "./ImprirmirPdf";

export const ViewComprobantePdf = () => {
  const params = useParams();

  const [datos, setDatos] = useState([]);

  useEffect(() => {
    async function loadData() {
      const res = await client.get(`/comprobantes/${params.id}`);

      setDatos(res.data);
    }

    loadData();
  }, []);

  console.log(datos);

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <ImprimirComprobante datos={datos} />
    </PDFViewer>
  );
};
