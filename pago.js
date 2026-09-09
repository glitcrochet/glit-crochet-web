const tipoCompra =
    localStorage.getItem("tipoCompra");

const resumenPago =
    document.getElementById("resumenPago");

const botonPago =
    document.getElementById("botonPago");

const solicitud =
    JSON.parse(
        localStorage.getItem("solicitudPedido")
    );

const carrito =
    JSON.parse(
        localStorage.getItem("carrito")
    ) || [];


let total = 0;
let montoPago = 0;


/*
 * PERSONALIZA EL TUYO
 */

if (
    tipoCompra === "fixed" &&
    solicitud
) {

    total =
        Number(
            solicitud.precioFinal
        );

    montoPago =
        Number(
            solicitud.adelanto
        );


    let extrasHTML = "";

    if (
        solicitud.extras &&
        solicitud.extras.length > 0
    ) {

        extrasHTML = `
            <div class="detalles-pago">

                <h3>
                    Extras
                </h3>

                ${solicitud.extras.map(
                    extra => `
                        <p>
                            🔑 ${extra.name}
                            — +S/${Number(
                                extra.price
                            ).toFixed(2)}
                        </p>
                    `
                ).join("")}

            </div>
        `;
    }


    let opcionesHTML = "";

    if (
        solicitud.opciones &&
        solicitud.opciones.length > 0
    ) {

        opcionesHTML = `
            <div class="detalles-pago">

                <h3>
                    Personalización
                </h3>

                ${solicitud.opciones.map(
                    opcion => `
                        <p>
                            ${opcion.name}:
                            ${opcion.value}
                        </p>
                    `
                ).join("")}

            </div>
        `;
    }


    let tarjetaHTML = "";

    if (
        solicitud.comentario &&
        solicitud.comentario.trim() !== ""
    ) {

        tarjetaHTML = `
            <div class="detalles-pago">

                <h3>
                    💌 Tarjeta personalizada
                </h3>

                <p>
                    ${solicitud.comentario}
                </p>

                <p>
                    <strong>
                        Gratis
                    </strong>
                </p>

            </div>
        `;
    }


    resumenPago.innerHTML = `

        <h2>
            Resumen de pedido 🧶
        </h2>


        <div class="resumen-pago-producto">

            <h3>
                ${solicitud.name}
            </h3>

            <p>
                Precio base:
                <strong>
                    S/${Number(
                        solicitud.price
                    ).toFixed(2)}
                </strong>
            </p>

        </div>


        ${opcionesHTML}

        ${extrasHTML}

        ${tarjetaHTML}


        <hr>


        <p>
            <strong>
                Total del pedido:
                S/${total.toFixed(2)}
            </strong>
        </p>


        <p class="adelanto-destacado">

            <strong>
                Adelanto a pagar (50%):
                S/${montoPago.toFixed(2)}
            </strong>

        </p>


        <p>
            Saldo restante al entregar:
            S/${montoPago.toFixed(2)}
        </p>
    `;


/*
 * COMPRA DE STOCK
 */

} else if (
    carrito.length > 0
) {

    carrito.forEach(
        producto => {

            total +=
                Number(
                    producto.price
                ) *
                Number(
                    producto.cantidad
                );
        }
    );


    montoPago =
        total;


    resumenPago.innerHTML = `

        <h2>
            Resumen de tu compra 🧶
        </h2>


        ${carrito.map(
            producto => {

                let extrasHTML = "";

                if (
                    producto.extras &&
                    producto.extras.length > 0
                ) {

                    extrasHTML = `
                        <div class="detalles-pago">

                            <h3>
                                Extras
                            </h3>

                            ${producto.extras.map(
                                extra => `
                                    <p>
                                        🔑 ${
                                            extra.name
                                        }
                                        — +S/${
                                            Number(
                                                extra.price
                                            ).toFixed(2)
                                        }
                                    </p>
                                `
                            ).join("")}

                        </div>
                    `;
                }


                let tarjetaHTML = "";

                if (
                    producto.tarjeta &&
                    producto.tarjeta.incluida &&
                    producto.tarjeta.mensaje
                ) {

                    tarjetaHTML = `
                        <div class="detalles-pago">

                            <h3>
                                💌 Tarjeta personalizada
                            </h3>

                            <p>
                                ${
                                    producto.tarjeta.mensaje
                                }
                            </p>

                            <p>
                                <strong>
                                    Gratis
                                </strong>
                            </p>

                        </div>
                    `;
                }


                return `

                    <div
                        class="resumen-pago-producto"
                    >

                        <h3>
                            ${producto.name}
                        </h3>

                        <p>
                            Cantidad:
                            ${producto.cantidad}
                        </p>

                        <p>
                            Precio:
                            S/${Number(
                                producto.price
                            ).toFixed(2)}
                            c/u
                        </p>


                        ${extrasHTML}


                        <p>
                            Subtotal:
                            <strong>
                                S/${(
                                    Number(
                                        producto.price
                                    ) *
                                    Number(
                                        producto.cantidad
                                    )
                                ).toFixed(2)}
                            </strong>
                        </p>

                    </div>


                    ${tarjetaHTML}

                `;
            }
        ).join("")}


        <hr>


        <p>
            <strong>
                Total a pagar:
                S/${total.toFixed(2)}
            </strong>
        </p>

    `;


} else {

    resumenPago.innerHTML = `

        <h2>
            No encontramos tu pedido 😿
        </h2>

        <p>
            Regresa al catálogo y vuelve a intentarlo.
        </p>

    `;


    botonPago.style.display =
        "none";
}



/*
 * BOTÓN DE PAGO
 */

if (
    botonPago
) {

    botonPago.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "montoPagado",
                montoPago.toFixed(2)
            );


            localStorage.setItem(
                "totalPedido",
                total.toFixed(2)
            );


            window.location.href =
                "confirmacion.html";

        }
    );
}