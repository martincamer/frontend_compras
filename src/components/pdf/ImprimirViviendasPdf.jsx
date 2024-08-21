import {
  Document,
  Text,
  View,
  Page,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import { formatearDinero } from "../../helpers/formatearDinero";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";
import React from "react";

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

export const ImprimirPdfViviendasPdf = ({
  bienesDeUsoActualizado,
  materiaPrimaActualizado,
  subtotalBienesDeUso,
  subtotalMateriaPrima,
}) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ddd",
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      paddingVertical: 5,
    },
    header: {
      fontWeight: "bold",
      flex: 1,
      textAlign: "center",
      fontSize: 10,
      textTransform: "uppercase",
      fontFamily: "Montserrat",
    },
    header_width: {
      width: "50%",
      fontWeight: "bold",
      // flex: 1,
      textAlign: "center",
      fontSize: 10,
      textTransform: "uppercase",
      fontFamily: "Montserrat",
    },
    cell: {
      flex: 1,
      textAlign: "center",
      textTransform: "uppercase",
      fontSize: 10,
      fontFamily: "Montserrat",
      fontWeight: "medium",
    },
    cell_width: {
      width: "50%",
      // flex: 1,
      textAlign: "center",
      textTransform: "uppercase",
      fontSize: 10,
      fontFamily: "Montserrat",
      fontWeight: "medium",
    },
  });

  return (
    <Document
      style={{
        zIndex: "100",
      }}
    >
      <Page
        size="A4"
        style={{
          padding: "40px 20px",
          flexDirection: "column",
          display: "flex",
          gap: "10px",
        }}
      >
        <View
          style={{
            border: "1px solid #000",
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <Image
            src={logo}
            style={{
              width: "80px",
            }}
          />
        </View>
        <View
          style={{
            marginTop: "10px",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              fontFamily: "Montserrat",
              textTransform: "uppercase",
            }}
          >
            Productos de materia prima.
          </Text>
        </View>
        <View style={styles.container}>
          {/* Encabezados de la tabla */}
          <View style={styles.row}>
            <Text style={styles.header_width}>Desc.</Text>
            <Text style={styles.header}>Cat</Text>
            <Text style={styles.header}>Prec.</Text>
            <Text style={styles.header}>Cant.</Text>
            <Text style={styles.header}>Subtotal</Text>
          </View>

          {/* Filas de datos */}
          {materiaPrimaActualizado.map((p) => (
            <View key={p.id} style={styles.row}>
              {/* <Text style={styles.cell}>{p.id}</Text> */}
              <Text style={styles.cell_width}>{p.detalle}</Text>
              <Text style={styles.cell}>{p.categoria}</Text>
              <Text style={styles.cell}>
                {formatearDinero(Number(p.precio_und))}
              </Text>
              <Text style={styles.cell}>{p.cantidad}</Text>
              <Text style={styles.cell}>
                {formatearDinero(Number(p.cantidad) * Number(p.precio_und))}
              </Text>
            </View>
          ))}
        </View>
        <View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "medium",
              fontFamily: "Montserrat",
            }}
          >
            Subtotal{" "}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              {formatearDinero(Number(subtotalMateriaPrima))}
            </Text>
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "bold",
              fontFamily: "Montserrat",
              textTransform: "uppercase",
            }}
          >
            Productos de bienes de uso.
          </Text>
        </View>
        <View style={styles.container}>
          {/* Encabezados de la tabla */}
          <View style={styles.row}>
            <Text style={styles.header_width}>Detalle</Text>
            <Text style={styles.header}>Categoría</Text>
            <Text style={styles.header}>Precio Und</Text>
            <Text style={styles.header}>Cantidad</Text>
            <Text style={styles.header}>Subtotal</Text>
          </View>

          {/* Filas de datos */}
          {bienesDeUsoActualizado.map((p) => (
            <View key={p.id} style={styles.row}>
              {/* <Text style={styles.cell}>{p.id}</Text> */}
              <Text style={styles.cell_width}>{p.detalle}</Text>
              <Text style={styles.cell}>{p.categoria}</Text>
              <Text style={styles.cell}>
                {formatearDinero(Number(p.precio_und))}
              </Text>
              <Text style={styles.cell}>{p.cantidad}</Text>
              <Text style={styles.cell}>
                {formatearDinero(Number(p.cantidad) * Number(p.precio_und))}
              </Text>
            </View>
          ))}
        </View>
        <View>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "medium",
              fontFamily: "Montserrat",
            }}
          >
            Subtotal{" "}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              {formatearDinero(Number(subtotalBienesDeUso))}
            </Text>
          </Text>
        </View>

        <View
          style={{
            border: "1px",
            borderWidth: "1px",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "medium",
              fontFamily: "Montserrat",
            }}
          >
            Total de la vivienda{" "}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              {formatearDinero(
                Number(subtotalBienesDeUso) + Number(subtotalMateriaPrima)
              )}
            </Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};
