import React from "react";
import { Container, Navbar } from "react-bootstrap";

const NavCom: React.FC = props => {
  return (
    <Container>
      <Navbar
        bg="dark"
        variant="dark"
        style={{ color: "white", marginTop: "20px" }}
      >
        {props.children}
      </Navbar>
    </Container>
  );
};
export default NavCom;
