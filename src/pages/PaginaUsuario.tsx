import React, { useState, useEffect } from "react";
import Tabla from "../components/Tabla";
import { columna } from "../constants/Columna";
import { Container, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { Usuario } from "../models/Modelo";
import { fetchArmagedon } from "../core/Fetch";
import { Link } from "react-router-dom";
import NavCom from "../components/NavCom";
import Ventana from "../components/Ventana";

const PaginaUsuario = () => {
  const URLApi = "http://localhost/ARMAGEDONBK/api/Usuario/";

  useEffect(() => {
    ListarTodosLosUsuarios();
  }, []);

  const [listarUsuarios, setListarUsuario] = useState<Usuario[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  const columnasUsuario = [
    columna.ID,
    columna.Nombre,
    columna.Apellido,
    columna.Email,
    columna.Celular,
    columna.Pais,
    columna.Ciudad,
    columna.Accion
  ];

  function ListarTodosLosUsuarios() {
    fetchArmagedon.get(URLApi + "ConsultarTodos").then(objetoJson => {
      setListarUsuario(objetoJson);
    });
  }

  return (
    <Container>
      <NavCom>
        <h3 style={{ marginRight: "65%" }}>INFORME USUARIO</h3>

        <DropdownButton
          id="dropdown-basic-button"
          title="OPCIONES"
          variant="dark"
        >
          <Dropdown.Item onClick={() => setMostrarModal(true)}>
            AGREGAR
          </Dropdown.Item>
        </DropdownButton>
      </NavCom>

      <Tabla>
        <thead>
          <tr style={{ textTransform: "uppercase" }}>
            {columnasUsuario.map((col, i) => {
              return <th key={i}>{col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {listarUsuarios.map((usuario, i) => {
            return (
              <tr
                style={{ textTransform: "uppercase" }}
                key={usuario.Persona.ID}
              >
                <td>{usuario.Persona.ID}</td>
                <td>{usuario.Persona.Nombre}</td>
                <td>{usuario.Persona.Apellido}</td>
                <td>{usuario.Persona.Email}</td>
                <td>{usuario.Persona.Celular}</td>
                <td>{usuario.Persona.Ubicacion.Pais.Nombre}</td>
                <td>{usuario.Persona.Ubicacion.Ciudad.Nombre}</td>
                <td>
                  <Link to={{ pathname: "/Ingreso/" + usuario.Persona.ID }}>
                    <Button variant="secondary" block>
                      INGRESAR
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Tabla>

      <Ventana mostrarModal={mostrarModal}></Ventana>
    </Container>
  );
};

export default PaginaUsuario;
