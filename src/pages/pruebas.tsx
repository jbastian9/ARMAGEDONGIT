import React, { useRef } from "react";
import { Button, Form } from "react-bootstrap";

const Pruebas = () => {
  const numeros: any = useRef({ uno: null, dos: null, tres: null });
  function imprimir() {
    console.log(numeros);
  }
  return (
    <form>
      <input type="text" ref={numeros.uno} />
      <input type="text" ref={numeros.dos} />
      <Form.Control type="text" ref={numeros.tres} />

      <Button onClick={() => imprimir()}>Imprimir</Button>
    </form>
  );
};

export default Pruebas;
