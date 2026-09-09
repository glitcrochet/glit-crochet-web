const formularioReseña =
    document.getElementById("formularioReseña");

const listaReseñas =
    document.getElementById("listaReseñas");

const mensajeReseña =
    document.getElementById("mensajeReseña");


function mostrarEstrellas(rating) {

    return "★".repeat(rating) +
        "☆".repeat(5 - rating);

}


function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto ?? "";

    return div.innerHTML;

}


async function cargarReseñas() {

    if (!listaReseñas) {
        return;
    }

    const {
        data,
        error
    } =
        await supabaseClient
            .from("reviews")
            .select(
                "id, name, rating, review, created_at"
            )
            .eq("approved", true)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "❌ Error al cargar reseñas:",
            error
        );

        listaReseñas.innerHTML = `
            <p class="sin-reseñas">
                No pudimos cargar las reseñas en este momento.
            </p>
        `;

        return;
    }


    if (!data || data.length === 0) {

        listaReseñas.innerHTML = `
            <p class="sin-reseñas">
                Sé la primera persona en dejar una reseña 💚
            </p>
        `;

        return;
    }


    listaReseñas.innerHTML = "";


    data.forEach(reseña => {

        const tarjeta =
            document.createElement("article");

        tarjeta.className =
            "reseña-card";


        tarjeta.innerHTML = `

            <div class="reseña-estrellas">
                ${mostrarEstrellas(
                    Number(reseña.rating)
                )}
            </div>

            <p class="reseña-texto">
                ${escaparHTML(
                    reseña.review
                )}
            </p>

            <p class="reseña-nombre">
                — ${escaparHTML(
                    reseña.name
                )}
            </p>

        `;


        listaReseñas.appendChild(
            tarjeta
        );

    });

}


if (formularioReseña) {

    formularioReseña.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            mensajeReseña.textContent =
                "Enviando tu reseña... 💚";


            const nombre =
                document
                    .getElementById(
                        "nombreReseña"
                    )
                    .value
                    .trim();


            const correo =
                document
                    .getElementById(
                        "correoReseña"
                    )
                    .value
                    .trim();


            const ratingSeleccionado =
                document.querySelector(
                    'input[name="rating"]:checked'
                );


            const review =
                document
                    .getElementById(
                        "textoReseña"
                    )
                    .value
                    .trim();


            if (!ratingSeleccionado) {

                mensajeReseña.textContent =
                    "Por favor selecciona una valoración.";

                return;
            }


            const rating =
                Number(
                    ratingSeleccionado.value
                );


            const {
                error
            } =
                await supabaseClient
                    .from("reviews")
                    .insert({
                        name: nombre,
                        email: correo,
                        rating: rating,
                        review: review,
                        approved: false
                    });


            if (error) {

                console.error(
                    "❌ Error al guardar reseña:",
                    error
                );

                mensajeReseña.textContent =
                    "No pudimos enviar tu reseña. Inténtalo nuevamente.";

                return;
            }


            formularioReseña.reset();


            mensajeReseña.textContent =
                "¡Gracias por compartir tu experiencia! 💚 Tu reseña quedará pendiente de revisión.";


            setTimeout(() => {

                mensajeReseña.textContent = "";

            }, 7000);

        }
    );

}


cargarReseñas();