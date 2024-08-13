import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import medium from "../../fonts/Montserrat-Medium.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-Bold.ttf";

export const ImprimirProductos = ({ productos, fechaInicio, fechaFin }) => {
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
  return (
    <Document
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Page
        size="A4"
        style={{
          padding: "30px 30px",
        }}
      >
        <View
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
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
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: 12,
            }}
          >
            Productos filtrados comparación de precios por proveedor.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            border: "1px solid  #000",
            padding: "5px 5px",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: 12,
            }}
          >
            Fecha incio {fechaInicio}
          </Text>
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: 12,
            }}
          >
            Fecha fin de la busqueda {fechaFin}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "colum",
            gap: "5px",
            marginTop: 10,
          }}
        >
          {productos?.map((producto) => (
            <View
              key={`${producto.detalle}-${producto.proveedores
                .map((p) => p.nombre)
                .join("-")}`}
              style={{
                border: "1px solid #000",
                padding: "10px 10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <View
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: "bold",
                    fontSize: 12,
                    display: "flex",
                    flexDirection: "row",
                    gap: 3,
                    borderBottom: "0.5px solid #000",
                  }}
                >
                  <Text>Descripción:</Text>{" "}
                  <Text
                    style={{
                      fontFamily: "Montserrat",
                      fontWeight: "medium",
                      textTransform: "capitalize",
                      fontSize: 12,
                    }}
                  >
                    {producto.detalle}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Montserrat",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    <Text>Proveedores y Precio unitario:</Text>
                  </Text>
                  <View
                    style={{
                      borderBottom: "0.5px solid #000",
                    }}
                  >
                    {producto.proveedores.map((proveedor) => (
                      <View
                        key={`${producto.detalle}-${proveedor.nombre}`}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "5",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Montserrat",
                            fontSize: 11,
                            fontWeight: "medium",
                            textTransform: "capitalize",
                          }}
                        >
                          {proveedor.nombre} -
                        </Text>{" "}
                        <Text
                          style={{
                            fontFamily: "Montserrat",
                            fontSize: 11,
                            fontWeight: "bold",
                          }}
                        >
                          {Number(proveedor.precio_und).toLocaleString(
                            "es-AR",
                            {
                              style: "currency",
                              currency: "ARS",
                            }
                          )}{" "}
                          -
                        </Text>{" "}
                        <Text
                          style={{
                            fontFamily: "Montserrat",
                            fontSize: 11,
                            fontWeight: "bold",
                          }}
                        >
                          {new Date(proveedor.fecha).toLocaleDateString(
                            "es-AR"
                          )}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                {/* <View>
                  <Text
                    style={{
                      fontFamily: "Montserrat",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      fontSize: 12,
                    }}
                  >
                    Fecha del producto/compra:
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Montserrat",
                      fontWeight: "medium",
                      textTransform: "capitalize",
                      fontSize: 12,
                    }}
                  >
                    {new Date(producto.fecha).toLocaleDateString("es-AR")}
                  </Text>
                </View> */}
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
