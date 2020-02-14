import React, { useState, useEffect } from "react";
import NavCom from "../components/NavCom";
import Tabla from "../components/Tabla";
import { columna } from "../constants/Columna";
import { Container, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { Correo } from "../models/Modelo";
import { fetchArmagedon } from "../core/Fetch";

const PaginaCorreo = () => {
  let { id } = useParams();

  const URLApi = "http://localhost/ARMAGEDONBK/api/Correo/";
  const [listaCorreos, setListaCorreos] = useState<Correo[]>([]);

  const columnasCorreo = [
    columna.ID,
    columna.Correo,
    columna.Fecha,
    columna.Receptor,
    columna.Titulo,
    columna.Mensaje,
    columna.TipoArchivo,
    columna.Accion
  ];
  useEffect(() => {
    ListarCorreosEnviados();
  });

  function ListarCorreosEnviados() {
    fetchArmagedon
      .get(URLApi + "ConsultarPorID?UsuarioID=" + id)
      .then(objetoJson => {
        setListaCorreos(objetoJson);
      });
  }
  return (
    <Container>
      <NavCom>
        <h3 style={{ marginRight: "65%" }}>INFORME CORREO</h3>

        <DropdownButton
          id="dropdown-basic-button"
          title="OPCIONES"
          variant="dark"
        >
          <Dropdown.Item href="#/action-1">REDACTAR</Dropdown.Item>
          <Link to={{ pathname: "/Ingreso/" + id }}>
            <Dropdown.Item href="#/action-2">VOLVER</Dropdown.Item>
          </Link>
        </DropdownButton>
      </NavCom>
      <Tabla>
        <thead>
          <tr style={{ textTransform: "uppercase" }}>
            {columnasCorreo.map((col, i) => {
              return <th key={i}>{col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {listaCorreos.map((correo, i) => {
            return (
              <tr style={{ textTransform: "uppercase" }} key={correo.ID}>
                <td>{i + 1}</td>
                <td>{correo.ID}</td>
                <td>{correo.Fecha}</td>
                <td>{correo.Receptor}</td>
                <td>{correo.Titulo}</td>
                <td>{correo.Mensaje}</td>
                <td>{correo.TipoArchivo}</td>
                <td>
                  <Button variant="secondary" block>
                    PRE-VISUALIZAR
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

export default PaginaCorreo;
