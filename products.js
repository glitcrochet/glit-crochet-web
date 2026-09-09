const products = [

    // =========================
    // SNOOPY EN STOCK
    // =========================

    {
        id: 1,
        name: "Snoopy",
        price: 25,
        quantity: 2,
        size: "12 cm",

        description:
            "Snoopy tejido a mano con mucho cariño.",

        images: [
            "img/Snoopy-1.jpg",
            "img/Snoopy-2.jpg",
            "img/Snoopy-3.jpg"
        ],

        type: "stock",

        category: "amigurumis",

        // Opciones que NO aumentan el precio
        options: [
            {
                name: "Cambio de color",
                type: "text",
                price: 0
            }
        ],

        // Extras que SÍ aumentan el precio
        extras: [
            {
                name: "Añadir llavero",
                price: 1.50
            }
        ]
    },


    // =========================
    // GROOT EN STOCK
    // =========================

    {
        id: 2,
        name: "Groot",

        price: 25,

        quantity: 4,

        size: "12 cm",

        description:
            "Groot tejido a mano con mucho cariño.",

        images: [
            "img/Groot-1.jpg",
            "img/Groot-2.jpg"
        ],

        type: "stock",

        category: "llaveros",

        preparationTime:
            "Mínimo 3 días",

        // Opciones gratuitas
        options: [
            {
                name: "Cambio de color",
                type: "text",
                price: 0
            }
        ],

        // Extras con costo
        extras: [
            {
                name: "Añadir llavero",
                price: 1.50
            }
        ]
    },


    // =========================
    // EJEMPLO DE PRODUCTO
    // PARA COTIZACIÓN
    // =========================

    {
        id: 3,

        name: "Kenia OS",

        price: 75,

        quantity: 0,

        size: "18 cm aprox",

        description:
            "Amigurumi personalizado inspirado en Kenia OS.",

        images: [
            "img/Kenia-os-1.jpg"
        ],

        type: "stock",

        category: "amigurumis"
    },


    // =========================
    // SNOOPY
    // =========================

    {
        id: 4,
        name: "Snoopy",
        price: 25,
        quantity: 2,
        size: "12 cm",

        description:
            "Snoopy tejido a mano con mucho cariño.",

        images: [
            "img/Snoopy-1.jpg",
            "img/Snoopy-2.jpg",
            "img/Snoopy-3.jpg"
        ],

        type: "stock",

        category: "flores-ramos",

        options: [
            {
                name: "Cambio de color",
                type: "text",
                price: 0
            }
        ],

        extras: [
            {
                name: "Añadir llavero",
                price: 1.50
            }
        ]
    },


    // =========================
    // SNOOPY
    // =========================

    {
        id: 5,
        name: "Snoopy",
        price: 25,
        quantity: 2,
        size: "12 cm",

        description:
            "Snoopy tejido a mano con mucho cariño.",

        images: [
            "img/Snoopy-1.jpg",
            "img/Snoopy-2.jpg",
            "img/Snoopy-3.jpg"
        ],

        type: "stock",

        category: "llaveros",

        options: [
            {
                name: "Cambio de color",
                type: "text",
                price: 0
            }
        ],

        extras: [
            {
                name: "Añadir llavero",
                price: 1.50
            }
        ]
    }

];