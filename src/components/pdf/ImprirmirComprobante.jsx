import { Document, Text, View, Page, Image, Font } from "@react-pdf/renderer";
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

// Obtener la fecha actual
const fechaActual = new Date();

// Obtener el día de la semana (0 para domingo, 1 para lunes, ..., 6 para sábado)
const diaDeLaSemana = fechaActual.getDay();

// Obtener el día del mes
const diaDelMes = fechaActual.getDate();

// Obtener el mes (0 para enero, 1 para febrero, ..., 11 para diciembre)
const mes = fechaActual.getMonth();

// Obtener el año
const ano = fechaActual.getFullYear();

// Días de la semana en español
const diasSemana = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

// Meses en español
const meses = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

// Formatear la fecha
const fechaFormateada = `${diasSemana[diaDeLaSemana]} ${meses[mes]} / ${diaDelMes} / ${ano}`;

export const ImprimirComprobante = ({ datos }) => {
  return (
    <Document
      style={{
        zIndex: "100",
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
            padding: "20px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "2px",
            border: "1px solid #000",
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
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            border: "1px solid #000",
          }}
        >
          <Text
            style={{
              fontWeight: "normal",
              fontFamily: "Montserrat",
              fontSize: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <Text> Numero del comprobante </Text>
            <Text style={{ fontWeight: "bold" }}>N° {datos.id}</Text>
          </Text>

          <Text
            style={{
              fontWeight: "normal",
              fontFamily: "Montserrat",
              fontSize: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <Text> Fecha de creación </Text>
            <Text style={{ fontWeight: "bold" }}>
              {datos?.created_at?.split("T")[0]}
            </Text>
          </Text>

          <Text
            style={{
              fontWeight: "normal",
              fontFamily: "Montserrat",
              fontSize: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <Text> Proveedor </Text>
            <Text style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {datos.proveedor}
            </Text>
          </Text>

          <Text
            style={{
              fontWeight: "normal",
              fontFamily: "Montserrat",
              fontSize: "10px",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
            }}
          >
            <Text> Total del comprobante </Text>
            <Text style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {Number(datos?.total)?.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </Text>
          </Text>

          <View
            style={{
              border: "1px solid #000",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "15px",
            }}
          >
            <Image
              src={datos.imagen}
              style={{
                width: "400px",
                height: "500px",
                borderRadius: "15px",
                objectFit: "cover",
              }}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
};
