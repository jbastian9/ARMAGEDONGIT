import React from "react";
import { Container, Table } from "react-bootstrap";

const Tabla: React.FC = props => {
  return (
    <Container>
      <Table
        responsive
        striped
        bordered
        hover
        variant="dark"
        style={{ marginTop: "30px" }}
      >
        {props.children}
      </Table>
    </Container>
  );
};
export default Tabla;
