
//Tomo la clase del boton//
const Clickbutton = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')
let carrito = []


// Tomo el evento de click de cada boton y ejecuto la funcion de aniadir al carrito //
Clickbutton.forEach(btn => {
  btn.addEventListener('click', addToCarritoItem)
})

//********************************************************************************************//

//* LOCAL STORAGE *//

function addLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function () {
  const storage = JSON.parse(localStorage.getItem('carrito'));
  if (storage) {
    carrito = storage;
    renderCarrito()
  }
}


//********************************************************************************************//

//funcion para aniadir al carrito un item //
function addToCarritoItem(e) {

  //capturamos el boton que se le hizo 'click' //
  const button = e.target

  //obtenemos el contenedor del boton con su clase padre //
  const item = button.closest('.card')

  // obtenemos el contenido (textcontent) del titulo con su clase //
  const itemTitle = item.querySelector('.card-title').textContent;

  // obtenemos el contenido (textcontent) del titulo con su clase //
  const itemPrice = item.querySelector('.precio').textContent;

  // obtenemos el contenido (imagen) del titulo con su clase //
  const itemImg = item.querySelector('.card-img-top').src;

  const newItem = {
    title: itemTitle,
    precio: itemPrice,
    img: itemImg,
    cantidad: 1
  }

  addItemCarrito(newItem)
}

//********************************************************************************************//


//* FUNCION SUMAR PRODUCTOS IGUALES * // 

function sumaCantidad(e) {
  const sumaInput = e.target
  const tr = sumaInput.closest(".ItemCarrito")
  const title = tr.querySelector('.title').textContent;
  carrito.forEach(item => {
    if (item.title.trim() === title.trim()) {
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      CarritoTotal()
    }
  })
}


//********************************************************************************************//

function addItemCarrito(newItem) {


  //* Evento de alerta de producto addCarrito *//
  const alert = document.querySelector('.alert')

  setTimeout(function () {
    alert.classList.add('hide')
  }, 2000)
  alert.classList.remove('hide')

  const InputElemnto = tbody.getElementsByClassName('input__elemento')
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === newItem.title.trim()) {
      carrito[i].cantidad++;
      const inputValue = InputElemnto[i]
      inputValue.value++;
      CarritoTotal()
      return null;
    }
  }

  // pusheamos el nuevo item agregado al array //
  carrito.push(newItem)

  //ejecutamos funcion render para verlo en el carrito //
  renderCarrito()
}

//********************************************************************************************//

// funcion de render del producto completo en el carrito //
function renderCarrito() {
  tbody.innerHTML = ''

  //tomamos los elementos de array carrito le pasamos .map  para aplicarle una funcion a los elementos del array, con una funcion tomamos el 'TR' del html para renderizarlo en el carrito html //
  carrito.map(item => {
    const tr = document.createElement('tr')
    tr.classList.add('ItemCarrito')
    const Content = `
    
    <th scope="row">1</th>
            <td class="table__productos">
              <img src=${item.img}  alt="">
              <h6 class="title">${item.title}</h6>
            </td>
            <td class="table__price"><p>${item.precio}</p></td>
            <td class="table__cantidad">
              <input type="number" min="1" value=${item.cantidad} class="input__elemento">
              <button class="delete btn btn-danger">x</button>
            </td>
    
    `

    //manipulamos el tr del html para renderizarlo //
    tr.innerHTML = Content;
    tbody.append(tr)

    tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
    tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
  })
  CarritoTotal()
}
//********************************************************************************************//

function CarritoTotal() {
  let Total = 0;
  const itemCartTotal = document.querySelector('.itemCartTotal')
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", ''))
    Total = Total + precio * item.cantidad
  })


  // manipular el html con inner para modificarlo //

  itemCartTotal.innerHTML = `Total $${Total}`
  addLocalStorage();

}
//********************************************************************************************//


//* FUNCION REMOVER ARTICULO DEL CARRITO *//

function removeItemCarrito(e) {
  const buttonDelete = e.target
  const tr = buttonDelete.closest(".ItemCarrito")
  const title = tr.querySelector('.title').textContent;
  for (let i = 0; i < carrito.length; i++) {

    if (carrito[i].title.trim() === title.trim()) {
      carrito.splice(i, 1)
    }
  }

  const alert = document.querySelector('.alert-item-delete')

  setTimeout(function () {
    alert.classList.add('remove')
  }, 2000)
  alert.classList.remove('remove')

  tr.remove()
  CarritoTotal()
}

//********************************************************************************************//


//* ANIMACIONES jQ *//

//* al tocar el selector CARRITO desaparece el logo del sitio WEB * //

$("#pills-contact-tab").click(function () {
  $('#logo').slideUp(3000)
})

//* al tocar el selector PRODUCTOS aparece el logo del sitio WEB * //

$("#pills-profile-tab").click(function () {
  $('#logo').slideDown(3000)
})


//********************************************************************************************//

//* AJAX *//
// *peticion AJAX jQ sobre json de datos de service de maquinas electricas  ARCHIVO LOCAL *// 

$('#service').hide();

$('#importarJson').click(function () {

  $.ajax({
    type: 'GET',
    url: 'service.json',
    dataType: 'json'
  }).done((data) => {
    $.each(data, function (indice, persona) {
      let fila = $('<tr>');
      fila.append($(`<td>${persona.id}</td>`));
      fila.append($(`<td>${persona.nombre}</td>`));
      fila.append($(`<td>${persona.direccion}</td>`));
      fila.append($(`<td>${persona.provincia}</td>`));

      $('#service tbody').append(fila);
    });

    $('#service').show();
  });
});

