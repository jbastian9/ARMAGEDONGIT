import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route } from "react-router-dom";
import PaginaUsuario from "./pages/PaginaUsuario";
import PaginaContacto from "./pages/PaginaContacto";
import PaginaCorreo from "./pages/PaginaCorreo";
import PaginaIngreso from "./pages/PaginaIngreso";
import Pruebas from "./pages/pruebas";
//npm install eslint-plugin-react-hooks --save-dev
const App = () => {
  return (
    <Container fluid style={{ backgroundColor: "black" }}>
      <BrowserRouter>
        <Route path="/p" exact component={Pruebas} />
        <Route path="/Usuario" exact component={PaginaUsuario} />
        <Route path="/Ingreso/:id" children={<PaginaIngreso />} />
        <Route path="/Contacto/:id" children={<PaginaContacto />} />
        <Route path="/Correo/:id" children={<PaginaCorreo />} />
      </BrowserRouter>
    </Container>
  );
};

export default App;
