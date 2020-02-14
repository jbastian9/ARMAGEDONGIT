import React, { useState, useEffect } from "react";
import Tabla from "../components/Tabla";
import { columna } from "../constants/Columna";
import { Container, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { Contacto } from "../models/Modelo";
import { fetchArmagedon } from "../core/Fetch";
import { useParams, Link } from "react-router-dom";
import NavCom from "../components/NavCom";

const PaginaContacto = () => {
  let { id } = useParams();

  const URLApi = "http://localhost/ARMAGEDONBK/api/Contacto/";
  const [listaContactos, setListaContactos] = useState<Contacto[]>([]);

  const columnasContacto = [
    columna.ID,
    columna.Nombre,
    columna.Apellido,
    columna.Email,
    columna.Celular,
    columna.Pais,
    columna.Ciudad,
    columna.Estado,
    columna.Accion
  ];

  useEffect(() => {
    ListarTodosLosUsuarioDeUnContacto();
  });

  function ListarTodosLosUsuarioDeUnContacto() {
    fetchArmagedon
      .get(URLApi + "ConsultarPorID?UsuarioID=" + id)
      .then(objetoJson => {
        setListaContactos(objetoJson);
      });
  }

  return (
    <Container>
      <NavCom>
        <h3 style={{ marginRight: "60%" }}>INFORME CONTACTO</h3>

        <DropdownButton
          id="dropdown-basic-button"
          title="OPCIONES"
          variant="dark"
        >
          <Dropdown.Item href="#/action-1">AGREGAR</Dropdown.Item>
          <Link to={{ pathname: "/Ingreso/" + id }}>
            <Dropdown.Item href="#/action-2">VOLVER</Dropdown.Item>
          </Link>
        </DropdownButton>
      </NavCom>
      <Tabla>
        <thead>
          <tr style={{ textTransform: "uppercase" }}>
            {columnasContacto.map((col, i) => {
              return <th key={i}>{col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {listaContactos.map((contacto, i) => {
            return (
              <tr
                style={{ textTransform: "uppercase" }}
                key={contacto.Persona.ID}
              >
                <td>{contacto.Persona.ID}</td>
                <td>{contacto.Persona.Nombre}</td>
                <td>{contacto.Persona.Apellido}</td>
                <td>{contacto.Persona.Email}</td>
                <td>{contacto.Persona.Celular}</td>
                <td>{contacto.Persona.Ubicacion.Pais.Nombre}</td>
                <td>{contacto.Persona.Ubicacion.Ciudad.Nombre}</td>
                <td>{contacto.Estado ? "Activo" : "InActivo"}</td>
                <td>
                  <Button variant="secondary" block>
                    MODIFICAR
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Tabla>
    </Container>
  );
};

export default PaginaContacto;
