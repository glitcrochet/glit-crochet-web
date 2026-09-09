const formulario =
    document.getElementById(
        "formularioSolicitud"
    );


formulario.addEventListener(
    "submit",
    evento => {

        evento.preventDefault();


        const solicitudCotizacion = {

            personaje:
                document.getElementById(
                    "personaje"
                ).value.trim(),

            referencias:
                document.getElementById(
                    "referencias"
                ).value.trim(),

            tamano:
                document.getElementById(
                    "tamano"
                ).value.trim(),

            ropa:
                document.getElementById(
                    "ropa"
                ).value.trim(),

            colores:
                document.getElementById(
                    "colores"
                ).value.trim(),

            detalles:
                document.getElementById(
                    "detalles"
                ).value.trim(),

            fecha:
                document.getElementById(
                    "fecha"
                ).value,

            otros:
                document.getElementById(
                    "otros"
                ).value.trim(),

            tarjeta:
                document.getElementById(
                    "tarjeta"
                ).value.trim()

        };


        localStorage.setItem(
            "solicitudCotizacion",
            JSON.stringify(
                solicitudCotizacion
            )
        );


        /*
         * CREAR MENSAJE PARA WHATSAPP
         */

        let mensaje =
            "Hola, Glitter Crochet 🧶💚\n\n";

        mensaje +=
            "Quiero solicitar una cotización ✨\n\n";


        mensaje +=
            "*DETALLES DEL DISEÑO*\n";

        mensaje +=
            `Personaje / diseño: ${
                solicitudCotizacion.personaje
            }\n`;


        if (
            solicitudCotizacion.referencias
        ) {

            mensaje +=
                `Referencias: ${
                    solicitudCotizacion.referencias
                }\n`;

        }


        if (
            solicitudCotizacion.tamano
        ) {

            mensaje +=
                `Tamaño aproximado: ${
                    solicitudCotizacion.tamano
                }\n`;

        }


        if (
            solicitudCotizacion.ropa
        ) {

            mensaje +=
                `Ropa y accesorios: ${
                    solicitudCotizacion.ropa
                }\n`;

        }


        if (
            solicitudCotizacion.colores
        ) {

            mensaje +=
                `Colores: ${
                    solicitudCotizacion.colores
                }\n`;

        }


        if (
            solicitudCotizacion.detalles
        ) {

            mensaje +=
                `Detalles especiales: ${
                    solicitudCotizacion.detalles
                }\n`;

        }


        if (
            solicitudCotizacion.fecha
        ) {

            mensaje +=
                `Fecha requerida: ${
                    solicitudCotizacion.fecha
                }\n`;

        }


        if (
            solicitudCotizacion.otros
        ) {

            mensaje +=
                `Otros detalles: ${
                    solicitudCotizacion.otros
                }\n`;

        }


        if (
            solicitudCotizacion.tarjeta
        ) {

            mensaje +=
                `\n*💌 TARJETA PERSONALIZADA*\n`;

            mensaje +=
                `${solicitudCotizacion.tarjeta}\n`;

        }


        mensaje +=
            "\nNo hay precio automático. Espero la cotización 💚";


        /*
         * ABRIR WHATSAPP
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

    }
);