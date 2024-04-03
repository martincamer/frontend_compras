//imports
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
//import normales
import { PrimeReactProvider } from "primereact/api";
import RutaProtegida from "./layouts/RutaProtejida";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
  const { isAuth } = useAuth();

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
                <PrimeReactProvider>
                  <ProductosProvider>
                    <OrdenesProvider>
                      <SideBar />
                      <main className="min-h-full max-h-full h-full">
                        <Outlet />
                      </main>
                    </OrdenesProvider>
                  </ProductosProvider>
                </PrimeReactProvider>
              }
            >
              <Route index path="/" element={<Home />} />
              <Route index path="/productos" element={<Productos />} />
              <Route index path="/ordenes" element={<OrdenDeCompra />} />
              <Route index path="/orden/:id" element={<ViewOrden />} />
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
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
