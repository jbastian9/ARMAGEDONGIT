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
import { Contacto, Ciudad, Pais } from "../models/Modelo";
import { fetchArmagedon } from "../core/Fetch";
import { useParams } from "react-router-dom";
import NavCom from "../components/NavCom";
import Ventana from "../components/Ventana";
import { validarCampo } from "../logic/ValidarCampo";

const PaginaContacto = () => {
  let { id } = useParams();

  const URLApi = "http://localhost/ARMAGEDONBK/api/";
  const [listaContactos, setListaContactos] = useState<Contacto[]>([]);
  const [datosContacto, setDatosContacto] = useState<Contacto>();
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

  const [modalContacto, setModalContacto] = useState({
    titulo: "",
    blkCorreo: false,
    blkEstado: false,
    boton: "",
    accion: ""
  });

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

  const Nombre: any = useRef(null);
  const Apellido: any = useRef(null);
  const Email: any = useRef(null);
  const Celular: any = useRef(null);
  const Pais: any = useRef(null);
  const Ciudad: any = useRef(null);

  useEffect(() => {
    ListarTodosLosUsuarioDeUnContacto();
  }, []);

  function ListarTodosLosUsuarioDeUnContacto() {
    fetchArmagedon
      .get(URLApi + "Contacto/ConsultarTodosLosContactos?UsuarioID=" + id)
      .then(objetoJson => {
        setListaContactos(objetoJson);
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
    validarCampo.pais(Pais?.current.value)
      ? setBorder({ ...border, pais: "red" })
      : setBorder({ ...border, pais: "green" });
  }

  function AgregarOModificarModal(accion: string, ContactoID: number) {
    ObtenerTodosLosPaises();
    DatosContacoInvididual(ContactoID);
    if (accion === "CREAR") {
      setModalContacto({
        titulo: "NUEVO CONTACTO",
        blkCorreo: false,
        blkEstado: true,
        boton: "AGREGAR",
        accion: "CREAR"
      });
      setMostrarModal(true);
    } else if ((accion = "MODIFICAR")) {
      setModalContacto({
        titulo: "MODIFICAR DATOS",
        blkCorreo: true,
        blkEstado: false,
        boton: "ACTUALIZAR",
        accion: "MODIFICAR"
      });
      setMostrarModal(true);
      console.log(datosContacto);
    }
  }
  function DatosContacoInvididual(ContactoID: number) {
    fetchArmagedon
      .get(URLApi + "Contacto/ConsultarPorID?ContactoID=" + ContactoID)
      .then(objetoJson => {
        setDatosContacto(objetoJson);
      });
  }
  function validar(accion: string) {
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
      if (accion === "CREAR") {
        AgregarNuevoContacto();
      } else if ((accion = "MODIFICAR")) {
        console.log(datosContacto);
      }
      OcultarModal();
    }
  }

  function AgregarNuevoContacto() {
    const nuevoContacto: Contacto = {
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
      },
      Estado: true
    };

    fetchArmagedon
      .post(URLApi + "Contacto/Crear", nuevoContacto)
      .then(() => {
        ListarTodosLosUsuarioDeUnContacto();
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
        <h3 style={{ marginRight: "60%" }}>INFORME CONTACTO</h3>

        <DropdownButton
          id="dropdown-basic-button"
          title="OPCIONES"
          variant="dark"
        >
          <Dropdown.Item onClick={() => AgregarOModificarModal("CREAR", 0)}>
            AGREGAR
          </Dropdown.Item>

          <Dropdown.Item href={"/Ingreso/" + id}>VOLVER</Dropdown.Item>
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
                <td>{i + 1}</td>
                <td>{contacto.Persona.Nombre}</td>
                <td>{contacto.Persona.Apellido}</td>
                <td>{contacto.Persona.Email}</td>
                <td>{contacto.Persona.Celular}</td>
                <td>{contacto.Persona.Ubicacion.Pais.Nombre}</td>
                <td>{contacto.Persona.Ubicacion.Ciudad.Nombre}</td>
                <td>{contacto.Estado ? "Activo" : "InActivo"}</td>
                <td>
                  <Button
                    variant="secondary"
                    block
                    onClick={() =>
                      AgregarOModificarModal("MODIFICAR", contacto.Persona.ID)
                    }
                  >
                    MODIFICAR
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Tabla>
      <Ventana mostrarModal={mostrarModal} fnOcultarModal={OcultarModal}>
        <Modal.Header closeButton style={{ background: "grey" }}>
          <Modal.Title>{modalContacto.titulo}</Modal.Title>
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
                disabled={modalContacto.blkCorreo}
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
                as="select"
                style={{ borderColor: border.pais }}
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
                as="select"
                style={{ borderColor: border.ciudad }}
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
            <Form.Group controlId="formGroupPassword">
              <Form.Label>ESTADO</Form.Label>
              <Form.Control
                as="select"
                defaultValue={0}
                disabled={modalContacto.blkEstado}
              >
                <option value={0} label={"ACTIVO"}></option>
                <option value={1} label={"INACTIVO"}></option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formGroupPassword"></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: "black" }}>
          <Button
            variant="secondary"
            block
            onClick={() => validar(modalContacto.accion)}
          >
            {modalContacto.boton}
          </Button>
        </Modal.Footer>
      </Ventana>
    </Container>
  );
};

export default PaginaContacto;
