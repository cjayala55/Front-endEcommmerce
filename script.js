function getData(url){
  return fetch(url)
  .then(response => response.json())
  .then(data => {
        result = data;
  })
  .catch(error => console.error(error));
}

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
        return true;
  });
} else {
          // Manejar los errores de la API
          //console.log("Error en la solicitud");
      return false;
}
});
}

function filename(){
  var rutaAbsoluta = self.location.href;   
  var posicionUltimaBarra = rutaAbsoluta.lastIndexOf("/");
  var rutaRelativa = rutaAbsoluta.substring( posicionUltimaBarra + "/".length , rutaAbsoluta.length );
  if(window.location.search == ""){
       return rutaRelativa;
 }else{
  return rutaRelativa.substring(0, rutaRelativa.indexOf("?"));  
}

}

if(filename() == "registrarProducto.html"){

  $('#form').submit(function(e) {
        e.preventDefault();
        url = "http://127.0.0.1:8080/productos";
        producto = {
              "codigo": document.getElementById("codigo").value,
              "nombre": document.getElementById("nombre").value,
              "descropcion": document.getElementById("descripcion").value,
              "marca": document.getElementById("marca").value,
              "precio": document.getElementById("precio").value,
              "unidadesDisponibles": document.getElementById("unidadesDisponibles").value,
              "foto": document.getElementById("foto").files[0].name
        }

        sendData(url, producto)

        url = "http://127.0.0.1:8080/productos/upload/" + document.getElementById("foto").files[0].name
        const formData = new FormData();
        formData.append('file', document.getElementById("foto").files[0], document.getElementById("foto").files[0].name);
        fetch(url, {
              method: 'POST',
              body: formData
        })
        .then(response => {
                    // Hacer algo con la respuesta
              console.log("ok");
              window.location.href = "index.html"
        })
        .catch(error => {
              console.log("no");
        });
        
  });
}

if(filename() == "index.html"){


  document.getElementById("parametro").onchange = function(){
        document.getElementById("busqueda").name = document.getElementById("parametro").value;
  }

  const valores = window.location.search;
  const urlParams = new URLSearchParams(valores);
  var nombre = urlParams.get('nombre');
  var marca = urlParams.get('marca');

  let url = "http://127.0.0.1:8080/productos";

  if (nombre != null) {
        url += "/nombre/" + nombre.toLowerCase();
  }else if (marca != null) {
        url += "/marca/" + marca.toLowerCase();
  }

  
  getData(url).then(()=>{
        result.forEach(res => {
              let card = document.createElement("div");
              card.classList.add("col-md-3");
              card.classList.add("mb-3");
              card.innerHTML ='<div class="card border-dark">' +
              '<a href="producto.html?id=' + res.codigo + '"><img src="http://127.0.0.1:8080/productos/imagen/' + res.foto + '" class="card-img-top" alt="..."></a>' +
              '<div class="card-body">' +
              '<h5 class="card-title">' + res.nombre + '</h5>' +
              '<p class="text-info fs-3">' + res.precio + '</p>' +
              '<button id="product-' + res.codigo + '"  class="btn btn-primary">Comprar</button>' +
              '</div>' +
              '</div>';
              
              
              document.getElementById("productos").appendChild(card);
              document.getElementById("product-" + res.codigo).addEventListener("click", event=>{
                  let codidgo = event.srcElement.id;
                  codidgo = codidgo.replace("product-", "");
                  let url = "http://localhost:8080/carrito/" + getCookie("userId") + "/productos/" + codidgo
                  url = url.toString();
                  fetch(url).then(resposne=>{
                        alert("PRODUCTO AGREGADO AL CARRITO");
                  })
                
              });
              
            });
  });
}




if(filename() == "producto.html"){
  const valores = window.location.search;
  const urlParams = new URLSearchParams(valores);
  var id = urlParams.get('id');
  if(id != null){
        let url = "http://127.0.0.1:8080/productos/codigo/" + id;
        let producto = null;
        getData(url).then(()=>{
              producto = result;
              document.getElementById("titulo").innerHTML = result.nombre; 
              document.getElementById("precio").innerHTML = "$ " + result.precio; 
              document.getElementById("descripcion").innerHTML = result.descropcion;
              document.getElementById("unidadesDisponibles").innerHTML = result.unidadesDisponibles;
              document.getElementById("foto").src = "http://127.0.0.1:8080/productos/imagen/" + result.foto;

        });
        cargarComentarios();
        document.getElementById("comentar").onclick = function(){
              const fecha = new Date().toDateString();
              let comentario = {
                    "id": 0,
                    "comentario": document.getElementById("comentario").value,
                    "fecha": fecha,
                    "producto": producto
              };
              document.getElementById("comentario").value = "";
              url = "http://127.0.0.1:8080/comentarios/" + id;

              setTimeout(()=>{
                  cargarComentarios()
            },200);

              sendData(url, comentario);
        }

  }
}


function cargarComentarios(){
  document.getElementById("comentarios").innerHTML = "";
  let url = "http://127.0.0.1:8080/comentarios/" + id;
  getData(url).then(()=>{
        result.forEach(comentario => {
              let coment = document.createElement("div");
              coment.classList.add("card");
              coment.classList.add("border-light");
              coment.classList.add("mb-3");
              coment.classList.add("p-1");
              c = "<h3>" + comentario.fecha + "</h3>"+
              "<p>" + comentario.comentario + "</p>";
              coment.innerHTML = c;
              document.getElementById("comentarios").appendChild(coment);
        });   

  });
}

(function(){
      let userName = getCookie("userNombre");
      const userLi = document.getElementById("userLi");
      if(userName != null){
            userLi.innerHTML = "Bienvenido " + userName + " <a class='btn btn-outline-light' href='carrito.html'>Ver carrito de compras</a>  <button class='btn btn-info' id='cerrarSesion'>Cerrar sesion</button>";
            document.getElementById("cerrarSesion").addEventListener("click", ()=>{
                  borrarCookie("userNombre");
                  window.location.href="index.html";
            })
          
      }else{
            userLi.innerHTML =  '<a class="nav-link" href="IniciarSesion.html"><i class="fas fa-user"></i> Iniciar sesión</a> ';
      }
})();
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


    function borrarCookie(nombre) {
      document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }