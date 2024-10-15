//imports
///////////////USER/////////////////////////////////////////////////////////////
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { NotFound } from "./routes/pages/protected/NotFound";
import { Login } from "./routes/pages/Login";
import { Register } from "./routes/pages/Register";
import { Home } from "./routes/pages/protected/Home";
import { ProductosProvider } from "./context/ProductosProvider";
import { Productos } from "./routes/pages/protected/Productos";
import { NavbarStatick } from "./components/ui/NavbarStatick";
import { OrdenesProvider } from "./context/OrdenesProvider";
import { OrdenDeCompra } from "./routes/pages/protected/OrdenDeCompra";
import { ProductosOrdenesFiltrador } from "./routes/pages/protected/ProductosOrdenesFiltrador";
import { OrdenDeCompraRegistros } from "./routes/pages/protected/OrdenDeCompraRegistros";
import { ViewOrden } from "./routes/pages/protected/ViewOrden";
import { OrdenDeCompraCheckout } from "./routes/pages/protected/OrdenDeCompraCheckout";
import { ViewOrdenCheckout } from "./routes/pages/protected/ViewOrdenCheckout";
import { OrdenDeCompraRegistrosDos } from "./routes/pages/protected/OrdenDeCompraRegistrosDos";
import { ViewPdfProducto } from "./routes/pages/protected/ViewPdfProducto";
import { Proveedores } from "./routes/pages/protected/Proveedores";
import { Proveedor } from "./routes/pages/protected/Proveedor";
import { ViewComprobantePdf } from "./routes/pages/protected/ViewComprobantePdf";
import { Presupuestos } from "./routes/pages/protected/Presupuestos";
/////////////////////////////////////FIN USER///////////////////////////////////////////

////////////////////////////////////ADMIN//////////////////////////////////////////////
import { HomeAdmin } from "./routes/pages/protectedAdmin/HomeAdmin";
import { OrdenDeCompraAdmin } from "./routes/pages/protectedAdmin/OrdenDeCompraAdmin";
import { ProveedoresAdmin } from "./routes/pages/protectedAdmin/ProveedoresAdmin";
import { AdministrarCuentas } from "./routes/pages/protectedAdmin/AdministrarCuentas";
///////////////////////////////////ADMIN//////////////////////////////////////////////

//import normales
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";
import { useEffect, useState } from "react";
import { MenuMobile } from "./components/ui/MenuMobile";
import { Navbar } from "./components/ui/Navbar";
import { ViviendasCostos } from "./routes/pages/protected/ViviendasCostos";
import { ProductosComparativas } from "./routes/pages/protected/ProductosComparativas";
import { FaXRay } from "react-icons/fa";

function App() {
  const { isAuth, user } = useAuth();

  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Simula un tiempo de carga de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Desactiva la pantalla de carga después de 5 segundos
    }, 3000);

    return () => clearTimeout(timer); // Limpia el temporizador cuando se desmonta
  }, []);

  if (isLoading) {
    // Muestra la pantalla de carga mientras se está cargando
    return <LoadingScreen />;
  }

  const adminRoutes = (
    <>
      <Route index path="/" element={<HomeAdmin />} />
      <Route index path="/cuentas" element={<AdministrarCuentas />} />
      <Route index path="/ordenes" element={<OrdenDeCompraAdmin />} />
      <Route index path="/orden/:id" element={<ViewOrden />} />
      <Route index path="/proveedores" element={<ProveedoresAdmin />} />
      <Route index path="/proveedores/:id" element={<Proveedor />} />
    </>
  );

  const userRoutes = (
    <>
      <Route index path="/" element={<Home />} />
      <Route index path="/productos" element={<Productos />} />
      <Route
        index
        path="/productos-comparativas"
        element={<ProductosComparativas />}
      />
      <Route index path="/presupuestos" element={<Presupuestos />} />
      <Route index path="/viviendas-costos" element={<ViviendasCostos />} />
      <Route index path="/ordenes" element={<OrdenDeCompra />} />
      <Route index path="/orden/:id" element={<ViewOrden />} />
      <Route index path="/proveedores" element={<Proveedores />} />
      <Route index path="/proveedores/:id" element={<Proveedor />} />
      <Route index path="/pdf-productos" element={<ViewPdfProducto />} />
      <Route
        index
        path="/pdf-comprobante/:id"
        element={<ViewComprobantePdf />}
      />
      <Route
        index
        path="/ordenes-checkout"
        element={<OrdenDeCompraCheckout />}
      />
      <Route index path="/orden-checkout/:id" element={<ViewOrdenCheckout />} />
      <Route
        index
        path="/registro-ordenes"
        element={<OrdenDeCompraRegistros />}
      />
      <Route
        index
        path="/registro-ordenes-checkout"
        element={<OrdenDeCompraRegistrosDos />}
      />
      <Route
        index
        path="/productos-ordenes"
        element={<ProductosOrdenesFiltrador />}
      />
    </>
  );

  return (
    <>
      <BrowserRouter>
        <NavbarStatick />
        <Routes>
          <Route
            element={<RutaProtegida isAllowed={!isAuth} redirectTo={"/"} />}
          >
            <Route index path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route
            element={<RutaProtegida isAllowed={isAuth} redirectTo={"/login"} />}
          >
            <Route
              element={
                <ProductosProvider>
                  <OrdenesProvider>
                    <main className="min-h-full max-h-full h-full">
                      <Navbar />
                      {/* <MenuMobile /> */}
                      <Outlet />
                    </main>
                  </OrdenesProvider>
                </ProductosProvider>
              }
            >
              {user?.tipo === "admin" ? adminRoutes : userRoutes}
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

const LoadingScreen = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100/80">
      <div className="flex flex-col items-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-primary border-b-transparent"></div>
        <p className="mt-4 text-lg font-bold text-gray-700">Cargando...</p>
      </div>
    </div>
  );
};
