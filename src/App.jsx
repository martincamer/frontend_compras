//imports
///////////////USER/////////////////////////////////////////////////////////////
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";
import { NotFound } from "./routes/pages/protected/NotFound";
import { Login } from "./routes/pages/Login";
import { Register } from "./routes/pages/Register";
import { Home } from "./routes/pages/protected/Home";
import { SideBar } from "./components/sidebar/Sidebar";
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
/////////////////////////////////////FIN USER///////////////////////////////////////////

////////////////////////////////////ADMIN//////////////////////////////////////////////
import { HomeAdmin } from "./routes/pages/protectedAdmin/HomeAdmin";
import { OrdenDeCompraAdmin } from "./routes/pages/protectedAdmin/OrdenDeCompraAdmin";
import { OrdenDeCompraRegistrosAdmin } from "./routes/pages/protectedAdmin/OrdenDeCompraRegistrosAdmin";
import { OrdenDeCompraCheckoutAdmin } from "./routes/pages/protectedAdmin/OrdenDeCompraCheckoutAdmin";
import { ProveedoresAdmin } from "./routes/pages/protectedAdmin/ProveedoresAdmin";
import { ProductosOrdenesFiltradorAdmin } from "./routes/pages/protectedAdmin/ProductosOrdenesFiltradorAdmin";
///////////////////////////////////ADMIN//////////////////////////////////////////////

//import normales
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";
import { OrdenDeCompraRegistrosDosAdmin } from "./routes/pages/protectedAdmin/OrdenDeCompraRegistrosDosAdmin";

function App() {
  const { isAuth, user } = useAuth();

  const adminRoutes = (
    <>
      <Route index path="/" element={<HomeAdmin />} />
      <Route index path="/ordenes" element={<OrdenDeCompraAdmin />} />
      <Route index path="/orden/:id" element={<ViewOrden />} />
      <Route index path="/proveedores" element={<ProveedoresAdmin />} />
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
        element={<OrdenDeCompraCheckoutAdmin />}
      />
      <Route index path="/orden-checkout/:id" element={<ViewOrdenCheckout />} />
      <Route
        index
        path="/registro-ordenes"
        element={<OrdenDeCompraRegistrosAdmin />}
      />
      <Route
        index
        path="/registro-ordenes-checkout"
        element={<OrdenDeCompraRegistrosDosAdmin />}
      />
      <Route
        index
        path="/productos-ordenes"
        element={<ProductosOrdenesFiltradorAdmin />}
      />
    </>
  );

  const userRoutes = (
    <>
      <Route index path="/" element={<Home />} />
      <Route index path="/productos" element={<Productos />} />
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
                    <main className="min-h-full max-h-full h-full flex">
                      <SideBar />
                      <Outlet />
                    </main>
                  </OrdenesProvider>
                </ProductosProvider>
              }
            >
              {user?.tipo === "admin" ? adminRoutes : userRoutes}
              {/* 
              <Route index path="/productos" element={<Productos />} />
              <Route index path="/ordenes" element={<OrdenDeCompra />} />
              <Route index path="/orden/:id" element={<ViewOrden />} />
              <Route index path="/proveedores" element={<Proveedores />} />
              <Route index path="/proveedores/:id" element={<Proveedor />} />

              <Route
                index
                path="/pdf-productos"
                element={<ViewPdfProducto />}
              />

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
              <Route
                index
                path="/orden-checkout/:id"
                element={<ViewOrdenCheckout />}
              />
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
              /> */}
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
