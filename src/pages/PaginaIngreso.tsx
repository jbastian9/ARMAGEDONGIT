import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Navbar,
  Form,
  DropdownButton,
  Dropdown,
  Button,
  Alert
} from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import { fetchArmagedon } from "../core/Fetch";
import { Usuario, Pais, Ciudad } from "../models/Modelo";
import { validarCampo } from "../logic/ValidarCampo";

const PaginaIngreso = () => {
  let { id } = useParams();
  let history = useHistory();

  const URLApi = "http://localhost/ARMAGEDONBK/api/";

  const [datosUsuario, setDatosUsuario] = useState<Usuario>();
  const [listaPaises, setListaPaises] = useState<Pais[]>([]);
  const [listaCiudades, setListaCiudades] = useState<Ciudad[]>([]);
  const [alert, setAlert] = useState({ vista: false, mensaje: "" });
  const [border, setBorder] = useState({
    nombre: "green",
    apellido: "green",
    email: "green",
    celular: "green",
    pais: "green",
    ciudad: "green"
  });

  const Nombre: any = useRef(null);
  const Apellido: any = useRef(null);
  const Email: any = useRef(null);
  const Celular: any = useRef(null);
  const Pais: any = useRef(null);
  const Ciudad: any = useRef(null);

  useEffect(() => {
    ObtenerTodosLosPaises();
    ObtenerDatosUsuario();
  }, []);

  function ObtenerDatosUsuario() {
    fetchArmagedon
      .get(URLApi + "Usuario/ConsultarPorID?UsuarioID=" + id)
      .then(objetoJson => {
        ObtenerTodasLasCiudadesDeUnPais(
          objetoJson.Persona.Ubicacion.Pais.ID
        ).then(() => setDatosUsuario(objetoJson));
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
    return fetchArmagedon
      .get(
        URLApi + "Ubicacion/ConsultarTodasLasCiudadesDeUnPais?PaisID=" + PaisID
      )
      .then(objetoJson => {
        setListaCiudades(objetoJson);
      });

    validarCampo.pais(Pais?.current.value)
      ? setBorder({ ...border, pais: "red" })
      : setBorder({ ...border, pais: "green" });
  }

  function validar() {
    if (validarCampo.nombre(Nombre?.current.value)) {
      setAlert({ vista: true, mensaje: "Nombre no valido" });
    } else if (validarCampo.apellido(Apellido?.current.value)) {
      setAlert({ vista: true, mensaje: "Apellido no valido" });
    } else if (validarCampo.email(Email?.current.value)) {
      setAlert({ vista: true, mensaje: "Email no valido" });
    } else if (validarCampo.celular(Celular?.current.value)) {
      setAlert({ vista: true, mensaje: "Celular no valido" });
    } else if (validarCampo.pais(Pais?.current.value)) {
      setAlert({ vista: true, mensaje: "Pais no valido" });
    } else if (validarCampo.ciudad(Ciudad?.current.value)) {
      setAlert({ vista: true, mensaje: "Ciudad no valido" });
    } else {
      ModificarDatosUsuario();
    }
  }

  function ModificarDatosUsuario() {
    const usuarioModificado: Usuario = {
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
    fetchArmagedon
      .put(URLApi + "Usuario/ModificarDatos", usuarioModificado)
      .then(() => {
        history.push("/Usuario");
      });
  }
  return (
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
              <Dropdown.Item href={"/Contacto/" + id}>CONTACTOS</Dropdown.Item>
              <Dropdown.Item href={"/Correo/" + id}>CORREOS</Dropdown.Item>
              <Dropdown.Item href={"/Usuario"}>SALIR</Dropdown.Item>
            </DropdownButton>
          </div>
        </Container>
      </Navbar>

      {datosUsuario && (
        <Form
          style={{
            marginTop: "5%",
            marginLeft: "15%",
            marginRight: "15%",
            color: "white"
          }}
          onChange={() => setAlert({ vista: false, mensaje: "" })}
        >
          <Form.Group controlId="formGroupEmail">
            <Form.Label>NOMBRE</Form.Label>
            <Form.Control
              ref={Nombre}
              type="text"
              style={{ borderColor: border.nombre }}
              defaultValue={datosUsuario?.Persona.Nombre}
              onChange={() => {
                validarCampo.nombre(Nombre?.current.value)
                  ? setBorder({ ...border, nombre: "red" })
                  : setBorder({ ...border, nombre: "green" });
              }}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>APELLIDO</Form.Label>
            <Form.Control
              ref={Apellido}
              type="text"
              style={{ borderColor: border.apellido }}
              defaultValue={datosUsuario?.Persona.Apellido}
              onChange={() => {
                validarCampo.apellido(Apellido?.current.value)
                  ? setBorder({ ...border, apellido: "red" })
                  : setBorder({ ...border, apellido: "green" });
              }}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>EMAIL</Form.Label>
            <Form.Control
              ref={Email}
              type="email"
              style={{ borderColor: border.email }}
              defaultValue={datosUsuario?.Persona.Email}
              disabled
              onChange={() => {
                validarCampo.email(Email?.current.value)
                  ? setBorder({ ...border, email: "red" })
                  : setBorder({ ...border, email: "green" });
              }}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>CÉLULAR</Form.Label>
            <Form.Control
              ref={Celular}
              type="text"
              style={{ borderColor: border.celular }}
              defaultValue={datosUsuario?.Persona.Celular}
              onChange={() => {
                validarCampo.celular(Celular?.current.value)
                  ? setBorder({ ...border, celular: "red" })
                  : setBorder({ ...border, celular: "green" });
              }}
              maxLength={10}
            />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>PAÍS</Form.Label>
            <Form.Control
              ref={Pais}
              as="select"
              style={{ borderColor: border.pais }}
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
              style={{ borderColor: border.ciudad }}
              defaultValue={datosUsuario?.Persona.Ubicacion.Ciudad.ID}
              onChange={() => {
                validarCampo.ciudad(Ciudad?.current.value)
                  ? setBorder({ ...border, ciudad: "red" })
                  : setBorder({ ...border, ciudad: "green" });
              }}
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
              onClick={() => validar()}
            >
              MODIFICAR DATOS
            </Button>
          </Form.Group>
          <Alert
            variant="danger"
            show={alert.vista}
            onClose={() => setAlert({ vista: false, mensaje: "" })}
          >
            {alert.mensaje}
          </Alert>
        </Form>
      )}
    </Container>
  );
};

export default PaginaIngreso;
