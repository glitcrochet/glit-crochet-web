const contenedor =
    document.getElementById("productosCarrito");

const totalCarrito =
    document.getElementById("totalCarrito");

const botonCheckout =
    document.getElementById("botonCheckout");


let carrito =
    JSON.parse(
        localStorage.getItem("carrito")
    ) || [];



function mostrarCarrito() {

    contenedor.innerHTML = "";


    if (carrito.length === 0) {

        contenedor.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío 🧶💚
            </p>
        `;

        totalCarrito.innerHTML = "";

        botonCheckout.style.display = "none";

        return;
    }


    let total = 0;


    carrito.forEach(
        (producto, indice) => {

            const subtotal =
                Number(producto.price) *
                Number(producto.cantidad);


            total += subtotal;


            const tarjeta =
                document.createElement("article");

            tarjeta.classList.add(
                "producto-carrito"
            );


            const tarjetaIncluida =
                producto.tarjeta &&
                producto.tarjeta.incluida;


            const mensajeTarjeta =
                producto.tarjeta &&
                producto.tarjeta.mensaje
                    ? producto.tarjeta.mensaje
                    : "";


            /*
             * EXTRAS
             */

            let extrasHTML = "";


            if (
                producto.extras &&
                producto.extras.length > 0
            ) {

                extrasHTML = `
                    <div class="extras-carrito">

                        <p>
                            <strong>
                                Extras:
                            </strong>
                        </p>

                        ${producto.extras.map(
                            (extra, extraIndice) => `
                                <p>
                                    🔑 ${
                                        extra.name
                                    }
                                    — +S/${
                                        Number(
                                            extra.price
                                        ).toFixed(2)
                                    }

                                    <button
                                        type="button"
                                        onclick="eliminarExtra(${indice}, ${extraIndice})"
                                    >
                                        Quitar
                                    </button>
                                </p>
                            `
                        ).join("")}

                    </div>
                `;

            }



            tarjeta.innerHTML = `

                <img
                    src="${producto.image}"
                    alt="${producto.name}"
                >


                <div
                    class="informacion-carrito"
                >

                    <h3>
                        ${producto.name}
                    </h3>


                    <p>
                        Precio:
                        S/ ${
                            Number(
                                producto.price
                            ).toFixed(2)
                        }
                    </p>


                    <div class="cantidad">

                        <button
                            onclick="disminuirCantidad(${indice})"
                        >
                            −
                        </button>

                        <span>
                            ${producto.cantidad}
                        </span>

                        <button
                            onclick="aumentarCantidad(${indice})"
                        >
                            +
                        </button>

                    </div>


                    ${extrasHTML}


                    <p>
                        Subtotal:
                        <strong>
                            S/ ${subtotal.toFixed(2)}
                        </strong>
                    </p>


                    <div
                        class="tarjeta-carrito"
                    >

                        <label>

                            <input
                                type="checkbox"
                                ${
                                    tarjetaIncluida
                                        ? "checked"
                                        : ""
                                }
                                onchange="cambiarTarjeta(${indice}, this.checked)"
                            >

                            💌 Añadir una tarjeta personalizada

                        </label>


                        <p>
                            Gratis · opcional
                        </p>


                        <textarea
                            id="mensajeTarjeta-${indice}"
                            placeholder="Ej.: Feliz cumpleaños, te quiero mucho..."
                            ${
                                tarjetaIncluida
                                    ? ""
                                    : "disabled"
                            }
                            onchange="guardarMensajeTarjeta(${indice})"
                        >${mensajeTarjeta}</textarea>

                    </div>


                    <button
                        class="eliminar"
                        onclick="eliminarProducto(${indice})"
                    >
                        Eliminar
                    </button>

                </div>

            `;


            contenedor.appendChild(
                tarjeta
            );

        }
    );


    totalCarrito.innerHTML = `
        <h2>
            Total:
            S/ ${total.toFixed(2)}
        </h2>
    `;


    botonCheckout.style.display =
        "block";
}



/*
 * AUMENTAR CANTIDAD
 */

function aumentarCantidad(
    indice
) {

    const producto =
        carrito[indice];


    const productoOriginal =
        products.find(
            p =>
                p.id === producto.id
        );


    const stockVendido =
        JSON.parse(
            localStorage.getItem(
                "stockVendido"
            )
        ) || {};


    const vendido =
        Number(
            stockVendido[
                producto.id
            ]
        ) || 0;


    const stockActual =
        Math.max(
            0,
            Number(
                productoOriginal?.quantity || 0
            ) - vendido
        );


    if (
        producto.cantidad >=
        stockActual
    ) {

        alert(
            "No hay más unidades disponibles 💚"
        );

        return;
    }


    producto.cantidad++;


    guardarCarrito();
}



/*
 * DISMINUIR CANTIDAD
 */

function disminuirCantidad(
    indice
) {

    if (
        carrito[indice].cantidad > 1
    ) {

        carrito[indice].cantidad--;

    } else {

        carrito.splice(
            indice,
            1
        );
    }


    guardarCarrito();
}



/*
 * ELIMINAR PRODUCTO
 */

function eliminarProducto(
    indice
) {

    carrito.splice(
        indice,
        1
    );


    guardarCarrito();
}



/*
 * ELIMINAR EXTRA
 */

function eliminarExtra(
    indiceProducto,
    indiceExtra
) {

    const producto =
        carrito[indiceProducto];


    if (
        !producto ||
        !producto.extras
    ) {
        return;
    }


    /*
     * Restar el precio del extra
     */

    const extra =
        producto.extras[
            indiceExtra
        ];


    if (!extra) {
        return;
    }


    producto.price =
        Number(
            producto.price
        ) -
        Number(
            extra.price
        );


    /*
     * Evitar números negativos
     */

    if (
        producto.price < 0
    ) {

        producto.price = 0;

    }


    producto.extras.splice(
        indiceExtra,
        1
    );


    guardarCarrito();
}



/*
 * ACTIVAR / DESACTIVAR TARJETA
 */

function cambiarTarjeta(
    indice,
    incluida
) {

    if (
        !carrito[indice].tarjeta
    ) {

        carrito[indice].tarjeta = {

            incluida:
                false,

            mensaje:
                ""

        };

    }


    carrito[indice].tarjeta.incluida =
        incluida;


    if (!incluida) {

        carrito[indice].tarjeta.mensaje =
            "";

    }


    guardarCarrito();
}



/*
 * GUARDAR MENSAJE DE TARJETA
 */

function guardarMensajeTarjeta(
    indice
) {

    const campo =
        document.getElementById(
            `mensajeTarjeta-${indice}`
        );


    if (!campo) {
        return;
    }


    if (
        !carrito[indice].tarjeta
    ) {

        carrito[indice].tarjeta = {

            incluida:
                true,

            mensaje:
                ""

        };

    }


    carrito[indice].tarjeta.mensaje =
        campo.value.trim();


    localStorage.setItem(
        "carrito",
        JSON.stringify(
            carrito
        )
    );
}



/*
 * GUARDAR CARRITO
 */

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(
            carrito
        )
    );


    mostrarCarrito();
}



/*
 * IR AL CHECKOUT
 */

botonCheckout.addEventListener(
    "click",
    () => {

        if (
            carrito.length === 0
        ) {

            alert(
                "Tu carrito está vacío."
            );

            return;
        }


        window.location.href =
            "checkout.html";

    }
);



mostrarCarrito();