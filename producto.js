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


const precioProducto =
    document.getElementById(
        "precioProducto"
    );


const stockProducto =
    document.getElementById(
        "stockProducto"
    );


const descripcionProducto =
    document.getElementById(
        "descripcionProducto"
    );


const tamanoProducto =
    document.getElementById(
        "tamanoProducto"
    );


const imagenPrincipal =
    document.getElementById(
        "imagenPrincipal"
    );


const miniaturas =
    document.getElementById(
        "miniaturas"
    );


const botonAnterior =
    document.getElementById(
        "anterior"
    );


const botonSiguiente =
    document.getElementById(
        "siguiente"
    );


const botonCarrito =
    document.getElementById(
        "botonCarrito"
    );


const botonPersonaliza =
    document.getElementById(
        "botonPersonaliza"
    );


const productosRelacionados =
    document.getElementById(
        "productosRelacionados"
    );


const extraLlavero =
    document.getElementById(
        "extraLlavero"
    );


const checkboxLlavero =
    document.getElementById(
        "llavero"
    );



/*
 * PRODUCTO NO ENCONTRADO
 */

if (!producto) {

    document.querySelector(
        "main"
    ).innerHTML = `

        <section class="detalle-producto">

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
     * INFORMACIÓN
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


    descripcionProducto.textContent =
        producto.description || "";


    tamanoProducto.textContent =
        producto.size
            ? `Tamaño: ${producto.size}`
            : "";



    /*
     * STOCK DESDE SUPABASE
     */

    let stockActual = 0;


    async function obtenerStockSupabase() {

        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("products")
                    .select("stock")
                    .eq(
                        "id",
                        producto.id
                    )
                    .maybeSingle();


            if (error) {

                console.error(
                    "❌ Error al consultar stock de Supabase:",
                    error
                );

                return null;
            }


            if (!data) {

                console.warn(
                    "⚠️ No se encontró este producto en Supabase:",
                    producto.id
                );

                return 0;
            }


            return Math.max(
                0,
                Number(
                    data.stock
                ) || 0
            );

        } catch (error) {

            console.error(
                "❌ Error inesperado al consultar stock:",
                error
            );

            return null;
        }
    }



    function actualizarVisualStock(
        stock
    ) {

        if (
            producto.type !== "stock"
        ) {

            stockProducto.textContent =
                "";

            if (botonCarrito) {

                botonCarrito.style.display =
                    "none";

            }

            return;
        }


        stockActual =
            Math.max(
                0,
                Number(stock) || 0
            );


        if (
            stockActual > 0
        ) {

            stockProducto.textContent =
                `🟢 ${stockActual} disponible${
                    stockActual > 1
                        ? "s"
                        : ""
                }`;

            stockProducto.className =
                "disponible";


            if (botonCarrito) {

                botonCarrito.style.display =
                    "block";

            }

        } else {

            stockProducto.textContent =
                "🔴 Agotado";

            stockProducto.className =
                "agotado";


            if (botonCarrito) {

                botonCarrito.style.display =
                    "none";

            }
        }
    }



    async function cargarStock() {

        if (
            producto.type !== "stock"
        ) {

            actualizarVisualStock(
                0
            );

            return;
        }


        const stock =
            await obtenerStockSupabase();


        if (
            stock === null
        ) {

            /*
             * Si Supabase no responde,
             * no inventamos un stock.
             */

            stockActual = 0;

            stockProducto.textContent =
                "No se pudo consultar el stock";

            stockProducto.className =
                "agotado";


            if (botonCarrito) {

                botonCarrito.style.display =
                    "none";

            }

            return;
        }


        actualizarVisualStock(
            stock
        );
    }



    /*
     * CARGAR STOCK INICIAL
     */

    cargarStock();



    /*
     * LLAVERO
     */

    const tieneLlavero =
        producto.extras &&
        producto.extras.some(
            extra =>
                extra.name ===
                "Añadir llavero"
        );


    if (
        tieneLlavero &&
        extraLlavero
    ) {

        extraLlavero.style.display =
            "block";

    }



    /*
     * GALERÍA
     */

    let imagenActual = 0;


    const imagenes =
        producto.images || [];


    function mostrarImagen(
        indice
    ) {

        if (
            !imagenes.length ||
            !imagenPrincipal
        ) {

            return;
        }


        imagenActual =
            indice;


        imagenPrincipal.src =
            imagenes[
                imagenActual
            ];


        imagenPrincipal.alt =
            producto.name;

    }



    function crearMiniaturas() {

        if (!miniaturas) {

            return;
        }


        miniaturas.innerHTML =
            "";


        imagenes.forEach(
            (
                imagen,
                indice
            ) => {

                const miniatura =
                    document.createElement(
                        "img"
                    );


                miniatura.src =
                    imagen;


                miniatura.alt =
                    `${producto.name} ${
                        indice + 1
                    }`;


                miniatura.addEventListener(
                    "click",
                    () => {

                        mostrarImagen(
                            indice
                        );

                    }
                );


                miniaturas.appendChild(
                    miniatura
                );

            }
        );

    }



    if (
        imagenes.length > 0
    ) {

        mostrarImagen(0);

        crearMiniaturas();

    }



    /*
     * ANTERIOR
     */

    if (botonAnterior) {

        botonAnterior.addEventListener(
            "click",
            () => {

                if (
                    !imagenes.length
                ) {

                    return;
                }


                imagenActual--;


                if (
                    imagenActual < 0
                ) {

                    imagenActual =
                        imagenes.length - 1;

                }


                mostrarImagen(
                    imagenActual
                );

            }
        );

    }



    /*
     * SIGUIENTE
     */

    if (botonSiguiente) {

        botonSiguiente.addEventListener(
            "click",
            () => {

                if (
                    !imagenes.length
                ) {

                    return;
                }


                imagenActual++;


                if (
                    imagenActual >=
                    imagenes.length
                ) {

                    imagenActual = 0;

                }


                mostrarImagen(
                    imagenActual
                );

            }
        );

    }



    /*
     * AGREGAR AL CARRITO
     */

    if (botonCarrito) {

        botonCarrito.style.display =
            "none";


        botonCarrito.addEventListener(
            "click",
            async () => {

                if (
                    producto.type !==
                    "stock"
                ) {

                    return;
                }


                /*
                 * CONSULTAR STOCK REAL
                 * JUSTO ANTES DE COMPRAR
                 */

                const stockDisponible =
                    await obtenerStockSupabase();


                if (
                    stockDisponible === null
                ) {

                    alert(
                        "No pudimos consultar el stock en este momento. Por favor, inténtalo nuevamente 💚"
                    );

                    return;
                }


                stockActual =
                    stockDisponible;


                actualizarVisualStock(
                    stockActual
                );


                if (
                    stockActual <= 0
                ) {

                    alert(
                        "Este producto está agotado 💚"
                    );

                    return;
                }



                let carrito =
                    JSON.parse(
                        localStorage.getItem(
                            "carrito"
                        )
                    ) || [];



                /*
                 * PRECIO DEL LLAVERO
                 */

                const llaveroSeleccionado =
                    checkboxLlavero &&
                    checkboxLlavero.checked;


                let extras =
                    [];


                if (
                    llaveroSeleccionado
                ) {

                    const extra =
                        producto.extras.find(
                            item =>
                                item.name ===
                                "Añadir llavero"
                        );


                    if (extra) {

                        extras.push({

                            name:
                                extra.name,

                            price:
                                Number(
                                    extra.price
                                )

                        });

                    }

                }



                /*
                 * PRECIO TOTAL DEL PRODUCTO
                 */

                const precioBase =
                    Number(
                        producto.price
                    );


                const precioExtras =
                    extras.reduce(
                        (
                            total,
                            extra
                        ) =>
                            total +
                            Number(
                                extra.price
                            ),
                        0
                    );


                const precioFinal =
                    precioBase +
                    precioExtras;



                /*
                 * BUSCAR PRODUCTO
                 */

                const productoExistente =
                    carrito.find(
                        item =>
                            item.id ===
                                producto.id &&
                            JSON.stringify(
                                item.extras || []
                            ) ===
                            JSON.stringify(
                                extras
                            )
                    );



                if (
                    productoExistente
                ) {


                    if (
                        productoExistente.cantidad >=
                        stockActual
                    ) {

                        alert(
                            "No hay más unidades disponibles 💚"
                        );

                        return;
                    }


                    productoExistente.cantidad++;


                } else {


                    carrito.push({

                        id:
                            producto.id,

                        name:
                            producto.name,

                        price:
                            precioFinal,

                        precioBase:
                            precioBase,

                        image:
                            imagenes.length
                                ? imagenes[0]
                                : "",

                        cantidad:
                            1,

                        extras:
                            extras,

                        tarjeta:
                            {
                                incluida:
                                    false,

                                mensaje:
                                    ""
                            }

                    });

                }



                localStorage.setItem(
                    "carrito",
                    JSON.stringify(
                        carrito
                    )
                );


                alert(
                    "Producto agregado al carrito 🧶💚"
                );


                window.location.href =
                    "carrito.html";

            }
        );

    }



    /*
     * PERSONALIZA EL TUYO
     */

    if (
        botonPersonaliza
    ) {


        if (
            producto.type ===
            "quote"
        ) {

            botonPersonaliza.textContent =
                "Solicitar cotización ✨";

        }



        botonPersonaliza.addEventListener(
            "click",
            () => {


                if (
                    producto.type ===
                    "quote"
                ) {

                    window.location.href =
                        "solicitud.html";

                    return;

                }


                window.location.href =
                    `pedido.html?id=${producto.id}`;

            }
        );

    }



    /*
     * PRODUCTOS RELACIONADOS
     */

    if (
        productosRelacionados
    ) {


        const relacionados =
            products.filter(
                p =>
                    p.id !==
                    producto.id
            );


        relacionados.forEach(
            relacionado => {


                const tarjeta =
                    document.createElement(
                        "article"
                    );


                tarjeta.classList.add(
                    "producto-relacionado"
                );


                const precio =
                    relacionado.price !== null &&
                    relacionado.price !== undefined

                        ? `S/ ${Number(
                            relacionado.price
                        ).toFixed(2)}`

                        : "Precio por confirmar";



                tarjeta.innerHTML = `

                    <img
                        src="${relacionado.images[0]}"
                        alt="${relacionado.name}"
                    >

                    <h3>
                        ${relacionado.name}
                    </h3>

                    <p class="precio">
                        ${precio}
                    </p>

                `;



                tarjeta.addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            `producto.html?id=${relacionado.id}`;

                    }
                );


                productosRelacionados.appendChild(
                    tarjeta
                );

            }
        );

    }

}