import React, { useState, useEffect, useRef } from "react";
import NavCom from "../components/NavCom";
import Tabla from "../components/Tabla";
import { columna } from "../constants/Columna";
import {
  Container,
  Button,
  DropdownButton,
  Dropdown,
  Modal,
  Form
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  Correo,
  Receptor,
  GuardarCorreo,
  VisualizarCorreo
} from "../models/Modelo";
import { fetchArmagedon } from "../core/Fetch";
import Ventana from "../components/Ventana";

const PaginaCorreo = () => {
  let { id } = useParams();

  const URLApi = "http://localhost/ARMAGEDONBK/api/";
  const [listaCorreos, setListaCorreos] = useState<Correo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [listaContactos, setListaContactos] = useState<Receptor[]>([]);
  const [receptor, setReceptor] = useState<any[]>([]);
  const [fechaA, setFechaA] = useState("");
  const [emisor, setEmisor] = useState("");
  const [correo, setCorreo] = useState<VisualizarCorreo>();
  const [camposCorreo, setCamposCorreo] = useState({
    receptorView: false,
    extensionView: false,
    bloquearTitulo: false,
    bloquearTexto: false,
    tituloModal: "Nuevo Correo",
    nombreBoton: "Enviar"
  });

  const columnasCorreo = [
    columna.ID,

    columna.Fecha,

    columna.Titulo,

    columna.TipoArchivo,
    columna.Accion
  ];

  const Fecha: any = useRef(null);
  const Emisor: any = useRef(null);
  const Receptor: any = useRef(null);
  const Titulo: any = useRef(null);
  const Mensaje: any = useRef(null);
  const Extension: any = useRef(null);

  useEffect(() => {
    ListarCorreosEnviados();
    ConsultarContactos();
    fechaActual();
    fnEmisor();
  }, []);

  function ObtenerCorreoReceptor() {
    //fetchArmagedon
  }

  function fechaActual() {
    const fecha = {
      año: new Date().getFullYear(),
      mes: new Date().getMonth(),
      dia: new Date().getDate(),
      hora: new Date().getHours(),
      minuto: new Date().getMinutes(),
      segundo: new Date().getSeconds()
    };
    //const fechaCompleta: string = fecha.año +"/" + fecha.mes + "/" + fecha.dia + " :" + fecha.hora + ":" + fecha.minuto + ":" + fecha.segundo;
    const fechaCompleta: string =
      fecha.año.toString() +
      "-" +
      fecha.mes.toString() +
      "-" +
      fecha.dia.toString() +
      " " +
      fecha.hora.toString() +
      ":" +
      fecha.minuto.toString() +
      ":" +
      fecha.segundo.toString() +
      " ";

    setFechaA(fechaCompleta);
  }

  function fnEmisor() {
    fetchArmagedon
      .get(URLApi + "/Correo/Emisor?UsuarioID=" + Number(id))
      .then(datJson => {
        setEmisor(datJson);
      });
  }

  function ListarCorreosEnviados() {
    fetchArmagedon
      .get(URLApi + "Correo/ConsultarPorID?UsuarioID=" + id)
      .then(objetoJson => {
        setListaCorreos(objetoJson);
      });
  }

  function ConsultarContactos() {
    fetchArmagedon
      .get(URLApi + "/Contacto/ListarReceptores?UsuarioID=" + Number(id))
      .then(datJson => {
        setListaContactos(datJson);
      });
  }

  function addReceptor(id: any) {
    if (id === "-1") {
      console.log("Seleccione Un Contacto");
      console.log(receptor.toString());
    } else {
      if (receptor.includes(id)) {
        console.log("Ya Agregado");
      } else {
        setReceptor(receptor.concat(id));
      }
    }
  }

  function eliminar(id: any) {
    if (receptor.includes(id)) {
      var i = receptor.indexOf(id);

      let receptorTemporal = [...receptor];
      receptorTemporal.splice(i, 1);
      setReceptor(receptorTemporal);
    }
  }

  function GuardarOVisualizar() {
    if (correo === undefined) {
      GuardarCorreo();
    } else {
      console.log("DESCARGANDO...");
      DescargarArchivo(correo.ID);
    }
  }

  function DescargarArchivo(correoID: number) {
    fetchArmagedon
      .get(URLApi + "/Correo/descargarArchivo?CorreoID=" + correoID)
      .then(datJson => {
        console.log(datJson);
      });
  }

  function GuardarCorreo() {
    const NuevoCorreo: GuardarCorreo = {
      Fecha: Fecha?.current.value,
      Emisor: Number(id),
      Receptor: receptor.toString(),
      Titulo: Titulo?.current.value,
      Mensaje: Mensaje?.current.value,
      TipoArchivo: Extension?.current.value
    };

    fetchArmagedon
      .post(URLApi + "/Correo/Guardar", NuevoCorreo)
      .then(data => {
        console.log(data);
      })
      .then(() => ListarCorreosEnviados());

    OcultarModal();
  }

  function RedactarCorreo() {
    setMostrarModal(true);
  }

  function VisualizarCorreo(CorreoID: number) {
    fetchArmagedon
      .get(URLApi + "/Correo/VisualizarCorreo?CorreoID=" + CorreoID)
      .then(data => {
        setCorreo(data);
        setCamposCorreo({
          receptorView: true,
          extensionView: true,
          bloquearTitulo: true,
          bloquearTexto: true,
          tituloModal: "¿Desea Descargar Este Archivo?",
          nombreBoton: "Descargar"
        });
      })
      .then(() => setMostrarModal(true));
  }

  function OcultarModal() {
    setCorreo(undefined);
    setMostrarModal(false);
    setCamposCorreo({
      receptorView: false,
      extensionView: false,
      bloquearTitulo: false,
      bloquearTexto: false,
      tituloModal: "Nuevo Correo",
      nombreBoton: "Enviar"
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
          <Dropdown.Item onClick={() => RedactarCorreo()}>
            REDACTAR
          </Dropdown.Item>
          <Dropdown.Item href={"/Ingreso/" + id}>VOLVER</Dropdown.Item>
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
              <tr style={{ textTransform: "uppercase" }} key={i + 1}>
                <td>{i + 1}</td>
                <td>{correo.Fecha}</td>
                <td>{correo.Titulo}</td>
                <td>{correo.TipoArchivo}</td>
                <td>
                  <Button
                    variant="secondary"
                    block
                    onClick={() => VisualizarCorreo(correo.ID)}
                  >
                    VISUALIZAR
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Tabla>

      <Ventana mostrarModal={mostrarModal} fnOcultarModal={OcultarModal}>
        <Modal.Header closeButton style={{ background: "grey" }}>
          <Modal.Title>{camposCorreo.tituloModal}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "black" }}>
          <Form
            style={{
              marginTop: "5%",
              marginLeft: "15%",
              marginRight: "15%",
              color: "white"
            }}
          >
            <Form.Group controlId="formGroupEmail">
              <Form.Label>FECHA</Form.Label>
              <Form.Control
                type="text"
                ref={Fecha}
                disabled
                defaultValue={correo === undefined ? fechaA : correo?.Fecha}
              />
            </Form.Group>

            <Form.Group controlId="formGroupEmail">
              <Form.Label>EMISOR</Form.Label>
              <Form.Control
                type="text"
                ref={Emisor}
                defaultValue={correo === undefined ? emisor : correo?.Emisor}
                disabled
              />
            </Form.Group>

            {correo && (
              <Form.Group controlId="formGroupEmail">
                <Form.Label>RECEPTOR</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  ref={Receptor}
                  defaultValue={correo === undefined ? "" : correo?.Receptor}
                  disabled
                />
              </Form.Group>
            )}

            <Form.Group
              controlId="formGroupPassword"
              hidden={camposCorreo.receptorView}
            >
              <Form.Label>RECEPTOR</Form.Label>
              <Form.Control
                as="select"
                ref={Receptor}
                onChange={() => addReceptor(Receptor?.current.value)}
              >
                <option value={-1} label={"---SELECCIONE---"}></option>
                {listaContactos.map((contacto, i) => {
                  return (
                    <option
                      key={i}
                      value={contacto.Email}
                      label={contacto.Email}
                    ></option>
                  );
                })}
              </Form.Control>
            </Form.Group>

            <Form.Group
              controlId="formGroupEmail"
              style={{ background: "grey", width: "100%" }}
              hidden={camposCorreo.receptorView}
            >
              {receptor.map((id, i) => {
                return (
                  <Button
                    key={i}
                    size="sm"
                    style={{
                      marginRight: "5px",
                      marginLeft: "5px",
                      marginTop: "5px",
                      width: "45%"
                    }}
                    onClick={() => eliminar(id)}
                  >
                    {id}
                  </Button>
                );
              })}
            </Form.Group>

            <Form.Group controlId="formGroupEmail">
              <Form.Label>TITULO</Form.Label>
              <Form.Control
                type="text"
                ref={Titulo}
                defaultValue={correo === undefined ? "" : correo?.Titulo}
                disabled={camposCorreo.bloquearTitulo}
              />
            </Form.Group>

            <Form.Group controlId="formGroupEmail">
              <Form.Label>MENSAJE</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                ref={Mensaje}
                defaultValue={correo === undefined ? "" : correo?.Mensaje}
                disabled={camposCorreo.bloquearTexto}
              ></Form.Control>
            </Form.Group>
            {correo && (
              <Form.Group controlId="formGroupEmail">
                <Form.Label>EXTENSION</Form.Label>
                <Form.Control
                  type="text"
                  ref={Extension}
                  defaultValue={correo === undefined ? "" : correo?.TipoArchivo}
                  disabled
                />
              </Form.Group>
            )}
            <Form.Group
              controlId="formGroupPassword"
              hidden={camposCorreo.extensionView}
            >
              <Form.Label>EXTENSION</Form.Label>
              <Form.Control as="select" ref={Extension}>
                <option value={-1} label={"---SELECCIONE---"}></option>
                <option value={".json"} label={"JSON"}></option>
                <option value={".xml"} label={"XML"}></option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: "black" }}>
          <Button
            variant="secondary"
            block
            onClick={() => GuardarOVisualizar()}
          >
            {camposCorreo.nombreBoton}
          </Button>
        </Modal.Footer>
      </Ventana>
    </Container>
  );
};

export default PaginaCorreo;
