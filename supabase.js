const SUPABASE_URL = "https://wvrgardovjejsojuifav.supabase.co";
const SUPABASE_KEY = "sb_publishable_PVJpBIczOqvGJfiXih_6sQ_uv2TcQKb";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
    async function sincronizarProductos() {

    for (const producto of products) {

        const stockInicial =
            Number(producto.quantity || 0);

        const { data, error } =
            await supabaseClient
                .from("products")
                .select("id, stock")
                .eq("id", producto.id)
                .maybeSingle();

        if (error) {
            console.error(
                "Error al revisar producto:",
                producto.id,
                error
            );
            continue;
        }

        if (!data) {

            const { error: insertarError } =
                await supabaseClient
                    .from("products")
                    .insert({
                        id: producto.id,
                        name: producto.name,
                        price: producto.price,
                        stock: stockInicial,
                        image:
                            producto.images &&
                            producto.images.length
                                ? producto.images[0]
                                : null
                    });

            if (insertarError) {
                console.error(
                    "Error al crear producto:",
                    producto.id,
                    insertarError
                );
            }
        }
    }
}