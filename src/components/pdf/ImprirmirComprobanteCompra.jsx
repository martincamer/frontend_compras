import { Document, Text, View, Page, Image, Font } from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import medium from "../../fonts/Montserrat-Medium.ttf";
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
      src: medium,
      fontWeight: "medium",
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

export const ImprirmirComprobanteCompra = ({ datos }) => {
  return (
    <Document
      style={{
        zIndex: "100",
      }}
    >
      <Page
        size="A4"
        style={{
          padding: "20px 40px",
          flexDirection: "column",
          display: "flex",
          gap: "10px",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <Text
              style={{
                fontSize: "8px",
                fontWeight: "medium",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
              }}
            >
              {datos.proveedor}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1px",
              }}
            >
              <Text
                style={{
                  fontSize: "8px",
                  fontWeight: "medium",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Provincia
                </Text>{" "}
                {datos.provincia}
              </Text>
              <Text
                style={{
                  fontSize: "8px",
                  fontWeight: "medium",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Localidad
                </Text>{" "}
                {datos.localidad}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
              }}
            >
              ORDEN DE COMPRA
            </Text>
            <View></View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
