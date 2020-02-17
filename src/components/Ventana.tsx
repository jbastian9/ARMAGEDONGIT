import React from "react";
import { Modal } from "react-bootstrap";

interface IPropsVentana {
  mostrarModal: boolean;
  fnOcultarModal: () => void;
}

const Ventana: React.FC<IPropsVentana> = props => {
  return (
    <Modal show={props.mostrarModal} onHide={props.fnOcultarModal}>
      {props.children}
    </Modal>
  );
};
export default Ventana;
