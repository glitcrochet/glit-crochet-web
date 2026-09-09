async function descontarStockSupabase(carrito) {

    for (const item of carrito) {

        const cantidad =
            Number(
                item.cantidad ??
                item.quantity ??
                0
            );

        const { data, error } =
            await supabaseClient.rpc(
                "descontar_stock",
                {
                    producto_id: Number(item.id),
                    cantidad_comprada: cantidad
                }
            );

        if (error) {

            console.error(
                "❌ Error al descontar stock:",
                error
            );

            return false;
        }

        if (data !== true) {

            console.warn(
                "⚠️ Stock insuficiente para:",
                item.name
            );

            return false;
        }
    }

    return true;
}


async function procesarConfirmacion() {

    const datosCliente =
        JSON.parse(
            localStorage.getItem(
                "datosCliente"
            )
        );

    const carrito =
        JSON.parse(
            localStorage.getItem(
                "carrito"
            )
        ) || [];

    const solicitud =
        JSON.parse(
            localStorage.getItem(
                "solicitudPedido"
            )
        );

    const tipoCompra =
        localStorage.getItem(
            "tipoCompra"
        );

    const montoPagado =
        localStorage.getItem(
            "montoPagado"
        );

    const totalPedido =
        localStorage.getItem(
            "totalPedido"
        );


    /*
     * NÚMERO DE PEDIDO
     *
     * Se guarda para que no cambie
     * si se actualiza la página.
     */

    let numeroPedido =
        localStorage.getItem(
            "numeroPedidoActual"
        );

    if (!numeroPedido) {

        numeroPedido =
            "GC-" +
            String(
                Date.now()
            ).slice(-4);

        localStorage.setItem(
            "numeroPedidoActual",
            numeroPedido
        );
    }

    const numeroPedidoElemento =
        document.getElementById(
            "numeroPedido"
        );

    if (
        numeroPedidoElemento
    ) {

        numeroPedidoElemento.textContent =
            numeroPedido;
    }


    /*
     * DESCONTAR STOCK
     *
     * Solo se hace UNA vez por pedido.
     */

    const claveStock =
        `stockProcesado_${numeroPedido}`;

    if (
        tipoCompra === "stock" &&
        carrito.length > 0 &&
        localStorage.getItem(
            claveStock
        ) !== "true"
    ) {

        const stockDescontado =
            await descontarStockSupabase(
                carrito
            );

        if (!stockDescontado) {

            alert(
                "Lo sentimos, uno de los productos ya no tiene stock suficiente. Por favor, revisa tu carrito."
            );

            return;
        }

        localStorage.setItem(
            claveStock,
            "true"
        );
    }


    /*
     * MENSAJE DE WHATSAPP
     */

    let mensaje = "";

    mensaje +=
        `Hola, Glitter Crochet 🧶💚\n\n`;

    mensaje +=
        `Acabo de realizar el pago de mi pedido ${numeroPedido}.\n\n`;


    /*
     * DATOS DEL CLIENTE
     */

    if (
        datosCliente
    ) {

        mensaje +=
            `*DATOS DEL CLIENTE*\n`;

        mensaje +=
            `Nombre: ${datosCliente.nombre}\n`;

        mensaje +=
            `Celular: ${datosCliente.celular}\n`;

        mensaje +=
            `Correo: ${datosCliente.correo}\n`;

        if (
            datosCliente.comentario
        ) {

            mensaje +=
                `Comentario general: ${datosCliente.comentario}\n`;
        }

        mensaje +=
            `\n`;
    }


    /*
     * PERSONALIZA EL TUYO
     */

    if (
        tipoCompra === "fixed" &&
        solicitud
    ) {

        mensaje +=
            `*PEDIDO PERSONALIZADO*\n`;

        mensaje +=
            `Producto: ${solicitud.name}\n`;

        mensaje +=
            `Precio base: S/${Number(
                solicitud.price
            ).toFixed(2)}\n`;

        if (
            solicitud.opciones &&
            solicitud.opciones.length > 0
        ) {

            mensaje +=
                `\n*PERSONALIZACIÓN*\n`;

            solicitud.opciones.forEach(
                opcion => {

                    mensaje +=
                        `- ${opcion.name}: ${opcion.value}\n`;
                }
            );
        }

        if (
            solicitud.extras &&
            solicitud.extras.length > 0
        ) {

            mensaje +=
                `\n*EXTRAS*\n`;

            solicitud.extras.forEach(
                extra => {

                    mensaje +=
                        `- ${extra.name}: +S/${Number(
                            extra.price
                        ).toFixed(2)}\n`;
                }
            );
        }

        if (
            solicitud.comentario &&
            solicitud.comentario.trim() !== ""
        ) {

            mensaje +=
                `\n*💌 TARJETA PERSONALIZADA*\n`;

            mensaje +=
                `${solicitud.comentario}\n`;
        }

        mensaje +=
            `\nTotal del pedido: S/${totalPedido}\n`;

        mensaje +=
            `Adelanto pagado (50%): S/${montoPagado}\n`;

        mensaje +=
            `Saldo pendiente: S/${montoPagado}\n`;

        mensaje +=
            `Tiempo de preparación: ${solicitud.preparationTime}\n`;

    } else {

        /*
         * COMPRA DE STOCK
         */

        mensaje +=
            `*COMPRA DE STOCK*\n`;

        carrito.forEach(
            producto => {

                const subtotal =
                    Number(
                        producto.price
                    ) *
                    Number(
                        producto.cantidad
                    );

                mensaje +=
                    `- ${producto.name} x ${producto.cantidad} — S/${subtotal.toFixed(2)}\n`;


                /*
                 * TARJETA
                 */

                if (
                    producto.tarjeta &&
                    producto.tarjeta.incluida &&
                    producto.tarjeta.mensaje
                ) {

                    mensaje +=
                        `  💌 Tarjeta: ${producto.tarjeta.mensaje}\n`;
                }


                /*
                 * EXTRAS
                 */

                if (
                    producto.extras &&
                    producto.extras.length > 0
                ) {

                    producto.extras.forEach(
                        extra => {

                            mensaje +=
                                `  🔑 ${extra.name}: +S/${Number(
                                    extra.price
                                ).toFixed(2)}\n`;
                        }
                    );
                }
            }
        );

        mensaje +=
            `\n*TOTAL PAGADO: S/${montoPagado}*\n`;
    }

    mensaje +=
        `\nAdjunto mi comprobante de pago.`;


    /*
     * BOTÓN WHATSAPP
     */

    const botonWhatsApp =
        document.getElementById(
            "botonWhatsApp"
        );

    if (
        botonWhatsApp
    ) {

        botonWhatsApp.addEventListener(
            "click",
            () => {

                /*
                 * IMPORTANTE:
                 * conserva aquí EXACTAMENTE
                 * el número que ya tenías.
                 */

                const numero =
                    "51976206458";


                const url =
                    `https://wa.me/${numero}?text=${encodeURIComponent(
                        mensaje
                    )}`;

                window.open(
                    url,
                    "_blank"
                );


                /*
                 * LIMPIAR PEDIDO
                 */

                localStorage.removeItem(
                    "carrito"
                );

                localStorage.removeItem(
                    "solicitudPedido"
                );

                localStorage.removeItem(
                    "datosCliente"
                );

                localStorage.removeItem(
                    "tipoCompra"
                );

                localStorage.removeItem(
                    "montoPagado"
                );

                localStorage.removeItem(
                    "totalPedido"
                );

                localStorage.removeItem(
                    "numeroPedidoActual"
                );

                localStorage.removeItem(
                    claveStock
                );
            }
        );
    }
}


procesarConfirmacion();