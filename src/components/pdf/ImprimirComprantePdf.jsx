import React from "react";
import { Document, Text, View, Page, Image, Font } from "@react-pdf/renderer";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import logo from "../../../public/logo.png";

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: normal,
    },
    {
      src: semibold,
      fontWeight: "semibold",
    },
    {
      src: bold,
      fontWeight: "bold",
    },
  ],
});

export const ImprimirComprantePdf = ({ datos, fechaInicio, fechaFin }) => {
  console.log(fechaFin);

  const totalAcumulado = datos.reduce((acc, proveedor) => {
    return acc + proveedor.total;
  }, 0);

  return (
    <Document
      style={{
        zIndex: "100",
        width: "100%",
        height: "100%",
      }}
    >
      <Page
        size="A4"
        style={{
          padding: "30px 60px",
          flexDirection: "column",
          display: "flex",
          gap: "10px",
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={logo}
            style={{
              width: 100,
            }}
          />
        </View>

        <View
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Comprobantes filtrados proveedores / total pagado
          </Text>

          <Text
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Fecha desde busqueda {fechaInicio} hasta {fechaFin}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {datos.map((c) => (
            <View
              style={{
                border: "1px solid #000",
                padding: "10px",
              }}
            >
              <Text
                style={{
                  fontWeight: "semibold",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  fontSize: "16px",
                }}
              >
                {c.proveedor}
                {/* {c?.category} */}
              </Text>
              <Text
                style={{
                  fontWeight: "semibold",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  fontSize: "13px",
                }}
              >
                {Number(c?.total).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
            </View>
          ))}

          <View
            style={{
              border: "1px solid #000",
              padding: "10px",
            }}
          >
            {" "}
            <Text
              style={{
                fontWeight: "semibold",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
                fontSize: "13px",
              }}
            >
              Subtotal comprobantes{" "}
              {Number(totalAcumulado).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
