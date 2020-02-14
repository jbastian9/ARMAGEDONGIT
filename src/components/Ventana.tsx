import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface IPropsVentana {
  mostrarModal: boolean;
}

const Ventana: React.FC<IPropsVentana> = props => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  return (
    <Modal show={props.mostrarModal}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="primary">Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default Ventana;
