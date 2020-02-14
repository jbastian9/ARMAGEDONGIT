//Metodos basicos Rest
class FetchArmagedon {
  get = (url: string): Promise<any> => {
    return fetch(url)
      .then(response => response.json())
      .catch(error => {
        console.log(error);
      });
  };

  post = (url: string, data: any): Promise<any> => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .catch(error => {
        console.log(error);
      });
  };

  put = (url: string, data: any): Promise<any> => {
    return fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .catch(error => {
        console.log(error);
      });
  };
}

export const fetchArmagedon = new FetchArmagedon();
