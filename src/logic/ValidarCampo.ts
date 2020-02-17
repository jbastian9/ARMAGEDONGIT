class ValidarCampo {
  nombre(dato: string) {
    if (dato === "") {
      return true;
    } else if (!/^([a-z])*$/.test(dato)) {
      return true;
    }
  }

  apellido(dato: string) {
    if (dato === "") {
      return true;
    } else if (!/^([a-z])*$/.test(dato)) {
      return true;
    }
  }

  email(dato: string) {
    if (dato === "") {
      return true;
    } else if (!/\S+@\S+\.\S+/.test(dato)) {
      return true;
    }
  }

  celular(dato: string) {
    if (dato === "") {
      return true;
    } else if (!/^\d{10}$/.test(dato)) {
      return true;
    }
  }

  pais(dato: string) {
    if (dato === "-1") {
      return true;
    }
  }

  ciudad(dato: string) {
    if (dato === "-1") {
      return true;
    }
  }
}
export const validarCampo = new ValidarCampo();
