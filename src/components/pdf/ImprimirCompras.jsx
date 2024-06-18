import { Page, Text, View, Document, Image, Font } from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import normal from "../../fonts/Montserrat-Light.ttf";
import medium from "../../fonts/Montserrat-Medium.ttf";
import semibold from "../../fonts/Montserrat-SemiBold.ttf";
import bold from "../../fonts/Montserrat-bold.ttf";

export const ImprimirCompras = ({ compras, fechaInicio, fechaFin, total }) => {
  const resumenPorProveedor = compras.reduce((resultado, orden) => {
    const proveedor = orden.proveedor;
    const precioFinal = parseFloat(orden.precio_final);

    if (!resultado[proveedor]) {
      resultado[proveedor] = {
        proveedor: proveedor,
        totalPrecioFinal: 0,
      };
    }

    resultado[proveedor].totalPrecioFinal += precioFinal;

    return resultado;
  }, {});

  const resumenFinal = Object.values(resumenPorProveedor);

  console.log(resumenFinal);

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
            marginTop: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            Compras filtradas
          </Text>
        </View>
        <View
          style={{
            border: "1px solid #000",
            padding: 10,
            fontFamily: "Montserrat",
            fontWeight: "semibold",
            fontSize: 10,
            marginTop: 10,
          }}
        >
          <Text>Fecha de inicio {fechaInicio}</Text>
          <Text>Fecha de fin {fechaFin}</Text>
        </View>
        <View
          style={{
            border: "1px solid #000",
            padding: 10,
            fontFamily: "Montserrat",
            fontWeight: "semibold",
            fontSize: 10,
            marginTop: 10,
          }}
        >
          <Text>Total en compras filtradas</Text>
          <Text
            style={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              fontSize: 10,
            }}
          >
            {Number(total).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </Text>
        </View>
        {resumenFinal?.map((c) => (
          <View
            style={{
              border: "1px solid #000",
              marginTop: "5px",
              padding: 12,
            }}
            key={c.id}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  fontSize: 10,
                }}
              >
                Proveedor/Compra{" "}
                <Text
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: "medium",
                    textTransform: "capitalize",
                    fontSize: 10,
                  }}
                >
                  {c.proveedor}
                </Text>
              </Text>
              <Text
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  fontSize: 10,
                }}
              >
                Total del proveedor en compras{" "}
                <Text
                  style={{
                    fontFamily: "Montserrat",
                    fontWeight: "medium",
                    textTransform: "capitalize",
                    fontSize: 10,
                  }}
                >
                  {Number(c.totalPrecioFinal).toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </Text>
              </Text>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};
