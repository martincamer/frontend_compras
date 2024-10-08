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
export const ListaDePrecios = ({ datos }) => {
  // Agrupa los productos por categoría
  const productosPorCategoria = datos.reduce((acc, producto) => {
    const categoria = producto.categoria;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(producto);
    return acc;
  }, {});

  return (
    <Document
      style={{
        zIndex: "100",
      }}
    >
      <Page
        size="A4"
        style={{
          padding: "40px 60px",
          flexDirection: "column",
          display: "flex",
          gap: "30px",
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
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <Text
              style={{
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontSize: "10px",
                textTransform: "uppercase",
              }}
            >
              Fecha
            </Text>
            <Text
              style={{
                fontFamily: "Montserrat",
                fontWeight: "normal",
                fontSize: "10px",
                textTransform: "uppercase",
              }}
            >
              {fechaFormateada}
            </Text>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: "10px",
              textTransform: "uppercase",
              textDecoration: "underline",
              marginHorizontal: 10,
            }}
          >
            LISTA DE PRECIOS/PRODUCTOS
          </Text>
        </View>

        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {Object.keys(productosPorCategoria).map((categoria, catIndex) => (
              <View key={catIndex}>
                {/* Mostrar el nombre de la categoría */}
                <Text
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    marginVertical: 5,
                  }}
                >
                  {categoria}
                </Text>

                {/* Mostrar los productos dentro de cada categoría */}
                {productosPorCategoria[categoria].map((producto, index) => (
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 5,
                      borderBottom: "1px",
                      borderStyle: "solid",
                      borderColor: "#000",
                      paddingBottom: "2px",
                    }}
                  >
                    <Text
                      style={{
                        width: "40%",
                        fontFamily: "Montserrat",
                        fontWeight: "semibold",
                        fontSize: "9px",
                        textTransform: "uppercase",
                      }}
                    >
                      {producto.detalle}
                    </Text>
                    <Text
                      style={{
                        width: "30%",
                        fontFamily: "Montserrat",
                        fontWeight: "semibold",
                        fontSize: "9px",
                        textTransform: "uppercase",
                      }}
                    >
                      {producto.categoria}
                    </Text>
                    <Text
                      style={{
                        width: "20%",
                        fontFamily: "Montserrat",
                        fontWeight: "bold",
                        fontSize: "9px",
                        textTransform: "uppercase",
                      }}
                    >
                      {Number(producto.precio_und).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
