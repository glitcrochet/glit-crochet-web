const contenedor =
    document.getElementById("productos");


// =====================================================
// CATEGORÍAS
// =====================================================

const categorias = [
    {
        id: "todos",
        nombre: "Todos"
    },
    {
        id: "amigurumis",
        nombre: "Amigurumis"
    },
    {
        id: "flores-ramos",
        nombre: "Flores y ramos"
    },
    {
        id: "llaveros",
        nombre: "Llaveros"
    }
];

let categoriaActual = "todos";


// =====================================================
// CREAR BOTONES DE FILTRO
// =====================================================

function crearFiltros() {

    const filtrosExistentes =
        document.getElementById("filtrosProductos");

    if (filtrosExistentes) {
        return;
    }


    const filtros =
        document.createElement("div");

    filtros.id =
        "filtrosProductos";

    filtros.className =
        "filtros-productos";


    categorias.forEach(categoria => {

        const boton =
            document.createElement("button");

        boton.type = "button";

        boton.className =
            "filtro-producto";

        boton.dataset.categoria =
            categoria.id;

        boton.textContent =
            categoria.nombre;


        if (categoria.id === "todos") {
            boton.classList.add("activo");
        }


        boton.addEventListener(
            "click",
            () => {

                categoriaActual =
                    categoria.id;


                document
                    .querySelectorAll(
                        ".filtro-producto"
                    )
                    .forEach(
                        botonFiltro => {
                            botonFiltro.classList.remove(
                                "activo"
                            );
                        }
                    );


                boton.classList.add("activo");


                mostrarProductos();
            }
        );


        filtros.appendChild(boton);
    });


    contenedor.parentNode.insertBefore(
        filtros,
        contenedor
    );
}


// =====================================================
// CARGAR CATÁLOGO
// =====================================================

async function cargarCatalogo() {

    try {

        console.log(
            "🔄 Cargando stock desde Supabase..."
        );


        const { data: stocks, error } =
            await supabaseClient
                .from("products")
                .select("id, stock");


        if (error) {

            console.error(
                "❌ No se pudo cargar el stock de Supabase:",
                error
            );

            return;
        }


        console.log(
            "✅ Stock recibido desde Supabase:",
            stocks
        );


        products.forEach(producto => {

            const stockSupabase =
                stocks.find(
                    item =>
                        Number(item.id) ===
                        Number(producto.id)
                );


            producto.stockActual =
                stockSupabase
                    ? Number(stockSupabase.stock)
                    : 0;
        });


        crearFiltros();

        mostrarProductos();


        console.log(
            "🎉 Catálogo cargado con stock de Supabase."
        );


    } catch (error) {

        console.error(
            "❌ Error inesperado al cargar el catálogo:",
            error
        );
    }
}


// =====================================================
// MOSTRAR PRODUCTOS
// =====================================================

function mostrarProductos() {

    /*
        Limpiamos únicamente las tarjetas.
        No creamos títulos ni grupos.
    */

    contenedor.innerHTML = "";


    /*
        Si un producto antiguo no tiene categoría,
        lo consideramos amigurumi para no perderlo.
    */

    const productosConCategoria =
        products.map(producto => {

            return {
                ...producto,

                category:
                    producto.category ||
                    "amigurumis"
            };
        });


    /*
        TODOS
        -------------------------
        Muestra todos los productos
        en la misma cuadrícula.
    */

    let productosMostrar =
        productosConCategoria;


    /*
        FILTROS
        -------------------------
        Cuando se selecciona una categoría,
        mostramos solamente esa categoría.
    */

    if (categoriaActual !== "todos") {

        productosMostrar =
            productosConCategoria.filter(
                producto =>
                    producto.category ===
                    categoriaActual
            );
    }


    /*
        Si no hay productos.
    */

    if (productosMostrar.length === 0) {

        contenedor.innerHTML = `
            <p class="sin-productos">
                Aún no hay productos en esta categoría.
            </p>
        `;

        return;
    }


    /*
        Creamos las tarjetas exactamente
        igual que antes.
    */

    productosMostrar.forEach(producto => {

        const tarjeta =
            crearTarjetaProducto(producto);


        contenedor.appendChild(
            tarjeta
        );
    });
}


// =====================================================
// CREAR TARJETA DE PRODUCTO
// =====================================================

function crearTarjetaProducto(producto) {

    const tarjeta =
        document.createElement("article");

    tarjeta.classList.add(
        "producto"
    );


    const stockActual =
        Number(
            producto.stockActual || 0
        );


    let contenido = `
        <img
            src="${producto.images[0]}"
            alt="${producto.name}"
        >

        <h3>${producto.name}</h3>

        <p class="precio">
            ${
                producto.price !== null &&
                producto.price !== undefined
                    ? `S/ ${Number(producto.price).toFixed(2)}`
                    : "Precio por confirmar"
            }
        </p>

        <p>
            ${producto.description || ""}
        </p>
    `;


    // =================================================
    // STOCK
    // =================================================

    if (producto.type === "stock") {

        if (stockActual > 0) {

            contenido += `
                <p class="disponible">
                    🟢 ${stockActual}
                    disponible${stockActual > 1 ? "s" : ""}
                </p>

                <button
                    class="boton-producto"
                    type="button"
                >
                    Ver producto ✨
                </button>
            `;

        } else {

            contenido += `
                <p class="agotado">
                    🔴 Agotado
                </p>

                <button
                    class="boton-producto"
                    type="button"
                >
                    Personaliza el tuyo 🧶
                </button>
            `;
        }


    // =================================================
    // FIXED
    // =================================================

    } else if (producto.type === "fixed") {

        contenido += `
            <p class="agotado">
                🧶 Personaliza el tuyo
            </p>

            <button
                class="boton-producto"
                type="button"
            >
                Personaliza el tuyo 🧶
            </button>
        `;


    // =================================================
    // QUOTE
    // =================================================

    } else if (producto.type === "quote") {

        contenido += `
            <p class="agotado">
                ✨ Personalizado
            </p>

            <button
                class="boton-producto"
                type="button"
            >
                Solicitar cotización
            </button>
        `;
    }


    tarjeta.innerHTML =
        contenido;


    // =================================================
    // ABRIR PRODUCTO
    // =================================================

    tarjeta.addEventListener(
        "click",
        () => {

            window.location.href =
                `producto.html?id=${producto.id}`;
        }
    );


    return tarjeta;
}


// =====================================================
// INICIAR CATÁLOGO
// =====================================================

cargarCatalogo();