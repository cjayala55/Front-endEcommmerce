fetch("http://localhost:8080/carrito/" + getCookie("userId"))
  .then(response => {
    return response.json();
  })
  .then(data => {
    let totalPrice = 0;
    data.products.forEach(element => {
      console.log(element);
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="http://127.0.0.1:8080/productos/imagen/${element.producto.foto}" alt="Producto" class="img-fluid">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${element.producto.nombre}</h5>
                <p class="card-text">Descripción del producto</p>
                <p class="card-text"><strong>Precio: </strong>$${element.producto.precio}</p>
                <button class="btn btn-danger" onclick="removeProduct(${element.id})">Quitar</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.getElementById("carrito-list").appendChild(div);

      totalPrice += element.producto.precio;
    });

    const totalPriceElement = document.getElementById("totalPrice");
    totalPriceElement.innerHTML = `$${totalPrice.toFixed(2)}`;
  });

function removeProduct(productId) {
  // Aquí puedes realizar la lógica para eliminar el producto del carrito
  console.log(`Eliminar producto con ID ${productId}`);
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
