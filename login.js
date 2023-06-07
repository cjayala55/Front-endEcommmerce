function login(user){
    fetch("http://localhost:8080/user/login", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
  }).then(function(response) {
    if(response.status == 404){
       document.getElementById("error").classList.remove("d-none");
    }else if (response.status == 200) {
            // Procesar la respuesta de la API
        response.json().then(function(data) {
            setCookie("userId", data.id, 7, "/");
            setCookie("userNombre", data.nombre, 7, "/");
            setCookie("userApellido", data.apellido, 7, "/");
            setCookie("userCorreo", data.coreo, 7, "/");
            setCookie("userTelefono", data.telefono, 7, "/");

         window.location.href = "index.html"
        return true;
    });
  } else {
            // Manejar los errores de la API
            //console.log("Error en la solicitud");
        return false;
  }
  });
  }


document.getElementById("form").addEventListener("submit", e=>{
    e.preventDefault();
    user = {
        "correo": document.getElementById("email").value,
        "contraseña": document.getElementById("password").value
    };
    login(user);

});

function setCookie(nombre, valor, expiracion, ruta) {
    var fechaExpiracion = new Date();
    fechaExpiracion.setTime(fechaExpiracion.getTime() + expiracion * 24 * 60 * 60 * 1000);
    var fechaExpiracionString = fechaExpiracion.toUTCString();
    document.cookie = nombre + "=" + valor + "; expires=" + fechaExpiracionString + "; path=" + ruta;
  }


function getCookie(nombre) {
  var nombreCookie = nombre + "=";
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf(nombreCookie) === 0) {
      return cookie.substring(nombreCookie.length, cookie.length);
    }
  }
  return null;
}



