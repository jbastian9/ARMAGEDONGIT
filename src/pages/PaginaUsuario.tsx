import React, { useState, useEffect, useRef } from "react";
import Tabla from "../components/Tabla";
import { columna } from "../constants/Columna";
import {
  Container,
  Button,
  DropdownButton,
  Dropdown,
  Modal,
  Form,
  Alert
} from "react-bootstrap";
import { Usuario, Pais, Ciudad } from "../models/Modelo";
import { fetchArmagedon } from "../core/Fetch";
import { Link } from "react-router-dom";
import NavCom from "../components/NavCom";
import Ventana from "../components/Ventana";
import { validarCampo } from "../logic/ValidarCampo";

const PaginaUsuario = () => {
  const URLApi = "http://localhost/ARMAGEDONBK/api/";

  useEffect(() => {
    ListarTodosLosUsuarios();
  }, []);

  const [listarUsuarios, setListarUsuario] = useState<Usuario[]>([]);
  const [listaPaises, setListaPaises] = useState<Pais[]>([]);
  const [listaCiudades, setListaCiudades] = useState<Ciudad[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [alert, setAlert] = useState({ vista: false, mensaje: "" });
  const [border, setBorder] = useState({
    nombre: "blue",
    apellido: "blue",
    email: "blue",
    celular: "blue",
    pais: "red",
    ciudad: "red"
  });

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

  const Nombre: any = useRef(true);
  const Apellido: any = useRef(null);
  const Email: any = useRef(null);
  const Celular: any = useRef(null);
  const Pais: any = useRef(null);
  const Ciudad: any = useRef(null);

  function ListarTodosLosUsuarios() {
    fetchArmagedon.get(URLApi + "Usuario/ConsultarTodos").then(objetoJson => {
      setListarUsuario(objetoJson);
    });
  }

  function MostrarModal() {
    setMostrarModal(true);
    ObtenerTodosLosPaises();
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

    validarCampo.pais(Pais?.current.value)
      ? setBorder({ ...border, pais: "red", ciudad: "red" })
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
      AgregarNuevoUsuario();
      OcultarModal();
    }
  }

  function AgregarNuevoUsuario() {
    const nuevoUsuario: Usuario = {
      Persona: {
        ID: 0,
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
      .post(URLApi + "Usuario/Crear", nuevoUsuario)
      .then(() => {
        ListarTodosLosUsuarios();
      })
      .then(() => OcultarModal());
  }

  function OcultarModal() {
    setMostrarModal(false);
    setBorder({
      nombre: "blue",
      apellido: "blue",
      email: "blue",
      celular: "blue",
      pais: "red",
      ciudad: "red"
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
          <Dropdown.Item onClick={() => MostrarModal()}>AGREGAR</Dropdown.Item>
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

      <Ventana mostrarModal={mostrarModal} fnOcultarModal={OcultarModal}>
        <Modal.Header closeButton style={{ background: "grey" }}>
          <Modal.Title>NUEVO USUARIO</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ background: "black" }}>
          <Alert
            variant="danger"
            show={alert.vista}
            onClose={() => setAlert({ vista: false, mensaje: "" })}
          >
            {alert.mensaje}
          </Alert>
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
                required
                onChange={() => {
                  setBorder({
                    ...border,
                    nombre: validarCampo.nombre(Nombre?.current.value)
                      ? "red"
                      : "green"
                  });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>APELLIDO</Form.Label>
              <Form.Control
                ref={Apellido}
                type="text"
                style={{ borderColor: border.apellido }}
                required
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
                required
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
                required
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
                style={{ borderColor: border.pais }}
                as="select"
                onChange={() =>
                  ObtenerTodasLasCiudadesDeUnPais(Pais?.current.value)
                }
                defaultValue={-1}
              >
                <option value={-1} label={"---SELECCIONE---"}></option>
                {listaPaises.map((pais, i) => {
                  return (
                    <option
                      key={i}
                      value={pais.ID}
                      label={pais.Nombre}
                    ></option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>CIUDAD</Form.Label>
              <Form.Control
                ref={Ciudad}
                style={{ borderColor: border.ciudad }}
                as="select"
                defaultValue={-1}
                onChange={() => {
                  validarCampo.ciudad(Ciudad?.current.value)
                    ? setBorder({ ...border, ciudad: "red" })
                    : setBorder({ ...border, ciudad: "green" });
                }}
              >
                <option value={-1} label={"---SELECCIONE---"}></option>
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
            <Form.Group controlId="formGroupPassword"></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: "black" }}>
          <Button variant="secondary" block onClick={() => validar()}>
            AGREGAR
          </Button>
        </Modal.Footer>
      </Ventana>
    </Container>
  );
};

export default PaginaUsuario;
