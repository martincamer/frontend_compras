import React from "react";
import {
  Document,
  Text,
  View,
  Page,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import logo from "../../../public/logo.png";
import { formatearFechaNormal } from "../../helpers/formatearFecha";
import { formatearDinero } from "../../helpers/formatearDinero";

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

export const ImprimirTodosLosComprobantes = ({
  datos,
  fechaInicio,
  fechaFin,
  datosAgrupados,
}) => {
  console.log(fechaFin);

  const totalAcumulado = datosAgrupados.reduce((acc, proveedor) => {
    return acc + proveedor.total;
  }, 0);

  const styles = StyleSheet.create({
    table: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: "#000",
      borderRadius: 2,
      overflow: "hidden",
      marginVertical: 10,
    },
    header: {
      flexDirection: "row",
      backgroundColor: "#f2f2f2",
      padding: 10,
    },
    headerText: {
      flex: 1,
      fontWeight: "semibold",
      fontFamily: "Montserrat",
      textTransform: "uppercase",
      fontSize: 11,
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#000",
      padding: 10,
    },
    cell: {
      textTransform: "uppercase",
      flex: 1,
      fontFamily: "Montserrat",
      fontSize: 10,
      fontWeight: "medium",
    },
  });

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
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
            }}
          >
            Comprobantes filtrados de la fecha
          </Text>

          <Text
            style={{
              fontSize: "12px",
              fontWeight: "semibold",
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
          <View style={styles.table}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Proveedor</Text>
              <Text style={styles.headerText}>Tipo</Text>
              <Text style={styles.headerText}>Fecha</Text>
              <Text style={styles.headerText}>Total</Text>{" "}
              {/* Agrega más encabezados si es necesario */}
            </View>
            {datos.map((c, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{c?.proveedor}</Text>
                <Text style={styles.cell}>{c?.tipo}</Text>
                <Text style={styles.cell}>
                  {formatearFechaNormal(c?.created_at)}
                </Text>
                <Text style={styles.cell}>
                  {formatearDinero(Number(c?.total))}
                </Text>{" "}
              </View>
            ))}
          </View>

          <View
            style={{
              borderBottom: "1px solid #000",
              borderTop: "1px solid #000",
              padding: "10px",
              backgroundColor: "#f2f2f2",
            }}
          >
            {" "}
            <Text
              style={{
                fontWeight: "semibold",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
                fontSize: "12px",
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
