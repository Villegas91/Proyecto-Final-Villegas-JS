const contenedorModal = document.getElementsByClassName("modal-contenedor")[0];
const botonAbrir = document.getElementById("carrito");
const botonCerrar = document.getElementById("carritoCerrar");
const modalCarrito = document.getElementsByClassName("modal-carrito")[0];
const contenedorCarrito = document.getElementById("carrito-contenedor");
const contadorCarrito = document.getElementById("contadorCarrito");
const cantidad = document.getElementById("cantidad");
const precioTotal = document.getElementById("precioTotal");
const cantidadTotal = document.getElementById("cantidadTotal");
const totalCompra = document.getElementById("totalCompra");
const lupa = document.getElementById("lupa");
const confirmarCompra = document.getElementById("confirmarCompra");

const products = [];
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);

    data.forEach((prod) => {
      products.push(prod);
      let div = document.createElement("div");

      div.innerHTML = `
      
      <div class="cards">
          <div class="img"><a href="#"><img src="${prod.img}"></a></div>
          <div class="description" onclick="init(a)"><p> ${prod.marca}</p>
          <div class="costo"> $ ${prod.precio}</div></div>
          <button class="boton" onclick="addToCart(${prod.id});">Agregar</button>
          </div>
         `;

      document.getElementById("ofertas").appendChild(div);
    });
  })

  .catch((e) => {
    console.log(e);
  });

//FILTRADO DE ARTICULOS
function buscador() {
  document.addEventListener("keyup", (e) => {
    if (e.target.matches("#search")) {
      document
        .querySelectorAll(".cards")
        .forEach((item) =>
          item.textContent.toLowerCase().includes(e.target.value.toLowerCase())
            ? item.classList.remove("filtro")
            : item.classList.add("filtro")
        );
    }
  });
}

buscador();

// ARRAY DEL CARRITO
let cart = [];

//CARGAMOS EL CARRITO DE COMPRAS GUARDADO EN EL LOCALSTORAGE
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    renderCart();
  }
});

//FUNCION PARA AGREGAR PRODUCTOS AL CARRITO Y SI ESTAN REPETIDOS SUMAR LAS UNIDADES
const addToCart = (prodId) => {
  const existe = cart.some((prod) => prod.id === prodId);
  if (existe) {
    const prod = cart.map((prod) => {
      prod.id === prodId && prod.cantidad++;
    });
  } else {
    const item = products.find((prod) => prod.id === prodId);
    //APLICAMOS SPREAD PARA LLENAR EL CART
    cart = [...cart, item];
  }

  renderCart();
};

//FUNCION PARA ELIMINAR UNA UNIDAD DEL PRODUCTO EN CARRITO

const deleteProd = (prodId) => {
  const existe = cart.some((prod) => prod.id === prodId);
  if (existe) {
    const prod = cart.map((prod) => {
      //OPERADOR TERNARIO AND
      prod.id === prodId && prod.cantidad--;
      //OPERADOR TERNARIO OR Y AND
      //SI LA CANTIDAD ES 0 O MENOR QUE 0 SE ELIMINA EL PRODUCTO
      (prod.cantidad === 0 || prod.cantidad < 0) && deleteCart(prodId);
    });
  }

  renderCart();
};

//FUNCION PARA ELIMINAR UN PRODUCTO DE NUESTRO CARRITO DE COMPRAS

const deleteCart = (prodId) => {
  const item = cart.find((prod) => prod.id === prodId);
  const indice = cart.indexOf(item);
  cart.splice(indice, 1);
  renderCart();
};

//FUNCION PARA ACTUALIZAR LOS PRODUCTOS EN EL CARRITO Y RELLENARLO
const renderCart = () => {
  contenedorCarrito.innerHTML = "";
  cart.forEach((prod) => {
    const div = document.createElement("div");
    div.classList.add("productoEnCarrito");
    div.innerHTML = `
      <div class="imgCart"><img src="${prod.img}"></div>
      <p>${prod.marca}</p>
      <p>Precio:$${prod.precio}</p>
      <button onclick="deleteProd(${prod.id})" class="boton-eliminar"><p>-</p></button>
      <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
      <button onclick="addToCart(${prod.id})" class="boton-eliminar"><p>+</p></button>
      <div class=pieCart>
      <button onclick="deleteCart(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt">X</i></button>
      </div>
      `;

    contenedorCarrito.appendChild(div);

    //GUARDAMOS LA INFORMACION DEL CART EN EL LOCAL STORAGE
    localStorage.setItem("cart", JSON.stringify(cart));
  });
  //SUMA DEL PRECIO TOTAL DEL CARRITO
  precioTotal.innerText = cart.reduce((a, b) => a + b.cantidad * b.precio, 0);
  totalCompra.innerText = cart.reduce((a, b) => a + b.cantidad * b.precio, 0);
};

//BOTON PARA VACIAR EL CARRITO MEDIANTE EL EVENTO CLICK
const botonVaciar = document.getElementById("vaciar-carrito");
botonVaciar.addEventListener("click", () => {
  cart.length = 0;
  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
});
//BOTON PARA ABRIR EL CARRITO ACTIVANDO LA CLASE MODAL-ACTIVE
botonAbrir.addEventListener("click", () => {
  if (cart.length === 0) {
    Swal.fire({
      title: "Tu carrito esta vacio",
      icon: "warning",

      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continuar",
    });
  } else contenedorModal.classList.toggle("modal-active");
});
//BOTON PARA CERRAR EL CARRITO DESACTIVANDO LA CLASE MODAL-ACTIVE
botonCerrar.addEventListener("click", () => {
  contenedorModal.classList.toggle("modal-active");
});

const filtrarCelular = () => {
  let a = products.filter((item) => item.categoria === "celular");
  console.log(a);
};

const filtrarComputacion = () => {
  let a = products.filter((item) => item.categoria === "computacion");
  console.log(a);
};
const filtrarImpresora = () => {
  let a = products.filter((item) => item.categoria === "impresora");
  console.log(a);
};
