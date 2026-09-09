async function sincronizarStockInicial() {
    try {
        console.log("🔄 Sincronizando productos con Supabase...");

        const { data, error } = await supabaseClient
            .from("products")
            .select("id, stock");

        if (error) {
            console.error("❌ Error al consultar Supabase:", error);
            return;
        }

        for (const producto of products) {

            const existente = data.find(
                item => Number(item.id) === Number(producto.id)
            );

            // Si el producto todavía no existe en Supabase,
            // lo registramos con el stock de products.js.
            if (!existente) {

                const { error: insertarError } =
                    await supabaseClient
                        .from("products")
                        .insert({
                            id: producto.id,
                            name: producto.name,
                            price: producto.price,
                            stock: Number(producto.quantity || 0),
                            image: producto.images?.[0] || ""
                        });

                if (insertarError) {
                    console.error(
                        `❌ No se pudo registrar ${producto.name}:`,
                        insertarError
                    );
                } else {
                    console.log(
                        `✅ ${producto.name} registrado en Supabase`
                    );
                }
            }
        }

        console.log("🎉 Sincronización inicial terminada.");

    } catch (error) {
        console.error("❌ Error inesperado:", error);
    }
}

sincronizarStockInicial();