const parametros =
    new URLSearchParams(
        window.location.search
    );

const id =
    Number(
        parametros.get("id")
    );


const producto =
    products.find(
        p => p.id === id
    );


const nombreProducto =
    document.getElementById(
        "nombreProducto"
    );


const imagenProducto =
    document.getElementById(
        "imagenProducto"
    );


const precioProducto =
    document.getElementById(
        "precioProducto"
    );


const tiempoProducto =
    document.getElementById(
        "tiempoProducto"
    );


const opcionesProducto =
    document.getElementById(
        "opcionesProducto"
    );


const comentarioPedido =
    document.getElementById(
        "comentarioPedido"
    );


const precioBase =
    document.getElementById(
        "precioBase"
    );


const precioExtra =
    document.getElementById(
        "precioExtra"
    );


const precioFinal =
    document.getElementById(
        "precioFinal"
    );


const adelanto =
    document.getElementById(
        "adelanto"
    );


const botonSolicitar =
    document.getElementById(
        "botonSolicitar"
    );


let extraTotal = 0;



if (!producto) {

    document.querySelector(
        "main"
    ).innerHTML = `

        <section class="pedido">

            <h1>
                Producto no encontrado 😿
            </h1>

            <a
                href="index.html"
                class="boton"
            >
                Volver al inicio
            </a>

        </section>

    `;

} else {


    /*
     * INFORMACIÓN DEL PRODUCTO
     */

    nombreProducto.textContent =
        producto.name;


    precioProducto.textContent =
        producto.price !== null &&
        producto.price !== undefined

            ? `S/ ${Number(
                producto.price
            ).toFixed(2)}`

            : "Precio por confirmar";


    tiempoProducto.textContent =
        producto.preparationTime ||
        "Mínimo 3 días";


    if (
        imagenProducto &&
        producto.images?.length
    ) {

        imagenProducto.src =
            producto.images[0];

        imagenProducto.alt =
            producto.name;

    }


    precioBase.textContent =
        `S/ ${Number(
            producto.price
        ).toFixed(2)}`;



    /*
     * OPCIONES DE PERSONALIZACIÓN
     */

    opcionesProducto.innerHTML =
        "";


    const opciones =
        producto.options &&
        producto.options.length > 0

            ? producto.options

            : [

                {
                    name:
                        "Cambio de color",

                    type:
                        "text",

                    price:
                        0
                },

            ];



    opciones.forEach(
        (
            opcion,
            indice
        ) => {


            const bloque =
                document.createElement(
                    "div"
                );


            bloque.classList.add(
                "opcion-pedido"
            );


            bloque.innerHTML = `

                <label
                    for="opcion-${indice}"
                >

                    <strong>
                        ${opcion.name}
                    </strong>

                    <span>
                        Sin costo adicional
                    </span>

                </label>


                <input
                    type="text"
                    id="opcion-${indice}"
                    placeholder="Ej.: cambio de color de ropa, cabello,zapatos,accesorios,etc..."
                >

            `;


            opcionesProducto.appendChild(
                bloque
            );

        }
    );



    /*
     * EXTRAS
     */

    if (
        producto.extras &&
        producto.extras.length > 0
    ) {


        producto.extras.forEach(
            (
                extra,
                indice
            ) => {


                const bloque =
                    document.createElement(
                        "div"
                    );


                bloque.classList.add(
                    "opcion-pedido"
                );


                bloque.innerHTML = `

                    <label>

                        <strong>
                            ${extra.name}
                        </strong>

                        <span>
                            + S/ ${
                                Number(
                                    extra.price
                                ).toFixed(2)
                            }
                        </span>

                    </label>


                    <label
                        class="extra-checkbox"
                    >

                        <input
                            type="checkbox"
                            id="extra-${indice}"
                        >

                        Añadir

                    </label>

                `;


                opcionesProducto.appendChild(
                    bloque
                );


                const checkbox =
                    document.getElementById(
                        `extra-${indice}`
                    );


                checkbox.addEventListener(
                    "change",
                    () => {


                        if (
                            checkbox.checked
                        ) {

                            extraTotal +=
                                Number(
                                    extra.price
                                );

                        } else {

                            extraTotal -=
                                Number(
                                    extra.price
                                );

                        }


                        actualizarPrecios();

                    }
                );

            }
        );

    }



    /*
     * ACTUALIZAR PRECIOS
     */

    function actualizarPrecios() {

        const total =
            Number(
                producto.price
            ) +
            extraTotal;


        const mitad =
            total / 2;


        precioExtra.textContent =
            `S/ ${extraTotal.toFixed(2)}`;


        precioFinal.textContent =
            `S/ ${total.toFixed(2)}`;


        adelanto.textContent =
            `S/ ${mitad.toFixed(2)}`;

    }



    actualizarPrecios();



    /*
     * CONTINUAR AL PAGO
     */

    botonSolicitar.addEventListener(
        "click",
        () => {


            const opcionesSeleccionadas =
                [];


            opciones.forEach(
                (
                    opcion,
                    indice
                ) => {


                    const campo =
                        document.getElementById(
                            `opcion-${indice}`
                        );


                    if (
                        campo &&
                        campo.value.trim() !== ""
                    ) {

                        opcionesSeleccionadas.push({

                            name:
                                opcion.name,

                            value:
                                campo.value.trim(),

                            price:
                                0

                        });

                    }

                }
            );



            const extrasSeleccionados =
                [];


            if (
                producto.extras
            ) {


                producto.extras.forEach(
                    (
                        extra,
                        indice
                    ) => {


                        const checkbox =
                            document.getElementById(
                                `extra-${indice}`
                            );


                        if (
                            checkbox &&
                            checkbox.checked
                        ) {

                            extrasSeleccionados.push({

                                name:
                                    extra.name,

                                price:
                                    Number(
                                        extra.price
                                    )

                            });

                        }

                    }
                );

            }



            const total =
                Number(
                    producto.price
                ) +
                extraTotal;


            const adelantoFinal =
                total / 2;



            const solicitud = {

                id:
                    producto.id,

                name:
                    producto.name,

                price:
                    Number(
                        producto.price
                    ),

                precioFinal:
                    total,

                adelanto:
                    adelantoFinal,

                image:
                    producto.images &&
                    producto.images.length
                        ? producto.images[0]
                        : "",

                opciones:
                    opcionesSeleccionadas,

                extras:
                    extrasSeleccionados,

                comentario:
                    comentarioPedido
                        ? comentarioPedido.value.trim()
                        : "",

                preparationTime:
                    producto.preparationTime ||
                    "Mínimo 3 días",

                type:
                    producto.type

            };



            localStorage.setItem(
                "solicitudPedido",
                JSON.stringify(
                    solicitud
                )
            );


            localStorage.setItem(
                "tipoCompra",
                "fixed"
            );


            window.location.href =
                "checkout.html";

        }
    );

}