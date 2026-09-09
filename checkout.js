const formulario =
    document.getElementById(
        "formularioCheckout"
    );

const solicitud =
    JSON.parse(
        localStorage.getItem(
            "solicitudPedido"
        )
    );

const carrito =
    JSON.parse(
        localStorage.getItem(
            "carrito"
        )
    ) || [];

formulario.addEventListener(
    "submit",
    evento => {

        evento.preventDefault();

        const nombre =
            document.getElementById(
                "nombre"
            ).value.trim();

        const celular =
            document.getElementById(
                "celular"
            ).value.trim();

        const correo =
            document.getElementById(
                "correo"
            ).value.trim();

        const comentario =
            document.getElementById(
                "comentario"
            ).value.trim();

        const datosCliente = {
            nombre,
            celular,
            correo,
            comentario
        };

        localStorage.setItem(
            "datosCliente",
            JSON.stringify(
                datosCliente
            )
        );


        /*
         * DETERMINAR TIPO DE COMPRA
         *
         * Si hay productos en el carrito,
         * es una compra de STOCK.
         *
         * Si no hay carrito pero existe
         * una solicitud, es PERSONALIZA
         * EL TUYO.
         */

        if (
            carrito.length > 0
        ) {

            localStorage.setItem(
                "tipoCompra",
                "stock"
            );

            /*
             * Evita que una solicitud vieja
             * interfiera con una compra nueva.
             */

            localStorage.removeItem(
                "solicitudPedido"
            );

        } else if (
            solicitud
        ) {

            localStorage.setItem(
                "tipoCompra",
                "fixed"
            );

        } else {

            alert(
                "No hay ningún producto para comprar."
            );

            return;
        }

        window.location.href =
            "pago.html";
    }
);