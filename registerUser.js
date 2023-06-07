function sendData(url, object){
    fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
  }).then(function(response) {
    if (response.ok) {
            // Procesar la respuesta de la API
        response.json().then(function(data) {
        window.location.href = "index.html";
        return true;
    });
  } else {
            // Manejar los errores de la API
            //console.log("Error en la solicitud");
        return false;
  }
  });
  }

  (function(){
    const form = document.getElementById('form');
    form.addEventListener('submit', event =>{
        event.preventDefault();
        let user = {
            "nombre": document.getElementById("name").value,
            "apellido": document.getElementById("lastName").value,
            "telefono": document.getElementById("phone").value,
            "correo": document.getElementById("email").value,
            "contraseña": document.getElementById("password").value
        };
        sendData("http://localhost:8080/user", user);                      
    });
  })();

