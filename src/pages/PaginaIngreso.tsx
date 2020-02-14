import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Navbar,
  Form,
  DropdownButton,
  Dropdown,
  Button
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { fetchArmagedon } from "../core/Fetch";
import { Usuario, Pais, Ciudad } from "../models/Modelo";

const PaginaIngreso = () => {
  let { id } = useParams();

  const URLApi = "http://localhost/ARMAGEDONBK/api/";

  const [datosUsuario, setDatosUsuario] = useState<Usuario>();
  const [listaPaises, setListaPaises] = useState<Pais[]>([]);
  const [listaCiudades, setListaCiudades] = useState<Ciudad[]>([]);

  const Nombre: any = useRef(null);
  const Apellido: any = useRef(null);
  const Email: any = useRef(null);
  const Celular: any = useRef(null);
  const Pais: any = useRef(null);
  const Ciudad: any = useRef(null);

  useEffect(() => {
    ObtenerDatosUsuario();
    ObtenerTodosLosPaises();
  }, []);

  function ObtenerDatosUsuario() {
    fetchArmagedon
      .get(URLApi + "Usuario/ConsultarPorID?UsuarioID=" + id)
      .then(objetoJson => {
        setDatosUsuario(objetoJson);
        console.log(objetoJson);
      });
  }

  function ObtenerTodosLosPaises() {
    fetchArmagedon
      .get(URLApi + "Ubicacion/ConsultarTodosLosPaises")
      .then(objetoJson => {
        setListaPaises(objetoJson);
      });
  }

  function ObtenerTodasLasCiudadesDeUnPais(PaisID: number) {
    fetchArmagedon
      .get(
        URLApi + "Ubicacion/ConsultarTodasLasCiudadesDeUnPais?PaisID=" + PaisID
      )
      .then(objetoJson => {
        setListaCiudades(objetoJson);
      });
  }

  function ModificarDatosUsuario() {
    const nuevo: Usuario = {
      Persona: {
        ID: Number(id),
        Nombre: Nombre?.current.value,
        Apellido: Apellido?.current.value,
        Email: Email?.current.value,
        Celular: Celular?.current.value,
        Ubicacion: {
          Pais: { ID: Number(Pais?.current.value), Nombre: "" },
          Ciudad: { ID: Number(Ciudad?.current.value), Nombre: "" }
        }
      }
    };
    fetchArmagedon.put(URLApi + "Usuario/ModificarDatos", nuevo).then(data => {
      console.log(data);
    });
  }
  return (
    <Container>
      <Container style={{ textTransform: "uppercase" }}>
        <Navbar
          bg="dark"
          variant="dark"
          style={{ color: "white", marginTop: "20px" }}
        >
          <Container fluid>
            <h3>
              {datosUsuario?.Persona.Nombre} {datosUsuario?.Persona.Apellido}
            </h3>
            <div style={{ float: "right", marginRight: "2%" }}>
              <DropdownButton
                id="dropdown-basic-button"
                title="OPCIONES"
                variant="dark"
              >
                <Link to={{ pathname: "/Contacto/" + id }}>
                  <Dropdown.Item href="#/action-1">CONTACTOS</Dropdown.Item>
                </Link>
                <Link to={{ pathname: "/Correo/" + id }}>
                  <Dropdown.Item href="#/action-2">CORREOS</Dropdown.Item>
                </Link>
                <Link to="/Usuario">
                  <Dropdown.Item href="#/action-3">SALIR</Dropdown.Item>
                </Link>
              </DropdownButton>
            </div>
          </Container>
        </Navbar>

        <Form
          style={{
            marginTop: "5%",
            marginLeft: "15%",
            marginRight: "15%",
            color: "white"
          }}
        >
          <Form.Group controlId="formGroupEmail">
            <Form.Label>NOMBRE</Form.Label>
            <Form.Control
              ref={Nombre}
              type="text"
              defaultValue={datosUsuario?.Persona.Nombre}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>APELLIDO</Form.Label>
            <Form.Control
              ref={Apellido}
              type="text"
              defaultValue={datosUsuario?.Persona.Apellido}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>EMAIL</Form.Label>
            <Form.Control
              ref={Email}
              type="email"
              defaultValue={datosUsuario?.Persona.Email}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>CÉLULAR</Form.Label>
            <Form.Control
              ref={Celular}
              type="number"
              defaultValue={datosUsuario?.Persona.Celular}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>PAÍS</Form.Label>
            <Form.Control
              ref={Pais}
              as="select"
              defaultValue={datosUsuario?.Persona.Ubicacion.Pais.ID}
              onChange={() =>
                ObtenerTodasLasCiudadesDeUnPais(Pais?.current.value)
              }
            >
              {listaPaises.map((pais, i) => {
                return (
                  <option key={i} value={pais.ID} label={pais.Nombre}></option>
                );
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>CIUDAD</Form.Label>
            <Form.Control
              ref={Ciudad}
              as="select"
              defaultValue={datosUsuario?.Persona.Ubicacion.Ciudad.ID}
            >
              {listaCiudades.map((ciudad, i) => {
                return (
                  <option
                    key={i}
                    value={ciudad.ID}
                    label={ciudad.Nombre}
                  ></option>
                );
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Button
              variant="secondary"
              style={{ float: "right" }}
              onClick={() => ModificarDatosUsuario()}
            >
              MODIFICAR DATOS
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
};

export default PaginaIngreso;
