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
  const totalFinalSum = datos?.datos?.productoSeleccionado.reduce(
    (total, producto) => total + producto.totalFinal,
    0
  );
  return (
    <Document
      style={{
        zIndex: "100",
      }}
    >
      <Page
        size="A4"
        style={{
          padding: "40px 40px",
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
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: "85px",
            }}
            src={logo}
          />
          <View
            style={{
              border: "1px solid #000",
              padding: "5px 12px",
            }}
          >
            <Text
              style={{
                fontSize: "8px",
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              ORDEN DE COMPRAS
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <Text
              style={{
                fontSize: "7px",
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              LUGAR Y FECHA{" "}
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "normal",
                  fontFamily: "Montserrat",
                }}
              >
                {new Date(datos.fecha_factura).toLocaleDateString("ars")}
              </Text>
            </Text>

            <Text
              style={{
                fontSize: "7px",
                fontWeight: "bold",
                fontFamily: "Montserrat",
              }}
            >
              ORDEN DE COMPRA N°{" "}
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "normal",
                  fontFamily: "Montserrat",
                }}
              >
                {datos.numero_factura}
              </Text>
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: "10px",
            marginHorizontal: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          <Text
            style={{
              fontSize: "7px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
              textTransform: "uppercase",
            }}
          >
            Proveedor{" "}
            <Text
              style={{
                fontSize: "7px",
                fontWeight: "normal",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
              }}
            >
              {datos.proveedor}
            </Text>
          </Text>

          <Text
            style={{
              fontSize: "7px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
              textTransform: "uppercase",
            }}
          >
            Localidad{" "}
            <Text
              style={{
                fontSize: "7px",
                fontWeight: "normal",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
              }}
            >
              {datos.localidad}
            </Text>
          </Text>

          <Text
            style={{
              fontSize: "7px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
              textTransform: "uppercase",
            }}
          >
            Pronvincia{" "}
            <Text
              style={{
                fontSize: "7px",
                fontWeight: "normal",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
              }}
            >
              {datos.provincia}
            </Text>
          </Text>
        </View>

        <View
          style={{
            marginTop: "10px",
            marginHorizontal: "10px",
          }}
        >
          <Text
            style={{
              fontSize: "7px",
              fontWeight: "bold",
              fontFamily: "Montserrat",
              textTransform: "uppercase",
            }}
          >
            Estimado proveedor porfavor de entregar los materiales que se
            detallan a continuación, según cantidades y precios detallados en la
            misma
          </Text>
        </View>

        <View
          style={{
            marginTop: "5px",
          }}
        >
          <View
            style={{
              border: "1px solid #000",
            }}
          >
            <View
              style={{
                padding: "10px 5px",
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                borderBottom: "1px solid #000",
              }}
            >
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  width: "10%",
                }}
              >
                Cant
              </Text>
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  width: "20%",
                }}
              >
                Descripción
              </Text>
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  width: "20%",
                }}
              >
                Fecha de entrega
              </Text>
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  width: "20%",
                }}
              >
                Precio und
              </Text>
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                  width: "20%",
                }}
              >
                Precio total
              </Text>
            </View>
            {datos?.datos?.productoSeleccionado?.map((p) => (
              <View
                style={{
                  padding: "10px 5px",
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  borderBottom: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    fontSize: "7px",
                    fontWeight: "medium",
                    fontFamily: "Montserrat",
                    textTransform: "uppercase",
                    width: "10%",
                  }}
                >
                  {p.cantidad}
                </Text>
                <Text
                  style={{
                    fontSize: "7px",
                    fontWeight: "medium",
                    fontFamily: "Montserrat",
                    textTransform: "uppercase",
                    width: "20%",
                  }}
                >
                  {p.detalle}
                </Text>
                <Text
                  style={{
                    fontSize: "7px",
                    fontWeight: "medium",
                    fontFamily: "Montserrat",
                    textTransform: "uppercase",
                    width: "20%",
                  }}
                >
                  {new Date(datos.fecha_factura).toLocaleDateString("ars")}
                </Text>
                <Text
                  style={{
                    fontSize: "7px",
                    fontWeight: "medium",
                    fontFamily: "Montserrat",
                    textTransform: "uppercase",
                    width: "20%",
                  }}
                >
                  {Number(p.precio_und).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </Text>
                <Text
                  style={{
                    fontSize: "7px",
                    fontWeight: "bold",
                    fontFamily: "Montserrat",
                    textTransform: "uppercase",
                    width: "20%",
                  }}
                >
                  {Number(p.totalFinal).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </Text>
              </View>
            ))}
            {[...Array(6)].map((_, index) => (
              <View
                key={`filler-${index}`}
                style={{
                  padding: "12px 5px",
                  display: "flex",
                  flexDirection: "row",
                  gap: "5px",
                  borderBottom: "1px solid #000",
                }}
              >
                {/* Puedes dejar el contenido vacío o agregar cualquier contenido de relleno que desees */}
              </View>
            ))}
          </View>
          <View
            style={{
              border: "1px solid #000",
              padding: "10px",
              marginTop: "5px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <Text
              style={{
                fontSize: "7px",
                fontWeight: "bold",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
              }}
            >
              Subtotal{" "}
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "medium",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                }}
              >
                {Number(totalFinalSum).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: "7px",
                fontWeight: "bold",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
              }}
            >
              IVA{" "}
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "medium",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                }}
              >
                {datos.iva}
              </Text>
            </Text>
            <Text
              style={{
                fontSize: "7px",
                fontWeight: "bold",
                fontFamily: "Montserrat",
                textTransform: "uppercase",
              }}
            >
              Total{" "}
              <Text
                style={{
                  fontSize: "7px",
                  fontWeight: "medium",
                  fontFamily: "Montserrat",
                  textTransform: "uppercase",
                }}
              >
                {Number(datos.precio_final).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
              </Text>
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
