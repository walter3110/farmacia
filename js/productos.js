// Catálogo de productos de la farmacia.
// Para agregar un producto, copiá un bloque y cambiá los datos.
// "categorias" usa los códigos de la lista CATEGORIAS de abajo (un producto puede estar en varias).
// Si "precioAnterior" es mayor que "precio", el producto aparece también en OFERTAS.

const CATEGORIAS = {
    "ofertas": { nombre: "Ofertas", descripcion: "Los productos con descuento de esta semana." },
    "skin-care": { nombre: "Skin Care", descripcion: "Rutinas de limpieza, hidratación y cuidado de la piel." },
    "solares": { nombre: "Solares", descripcion: "Protección solar para toda la familia." },
    "maquillaje": { nombre: "Maquillaje", descripcion: "Bases, labiales, máscaras y más." },
    "dermocosmetica": { nombre: "Dermocosmética", descripcion: "Productos dermatológicos para cada tipo de piel." },
    "cuidado-personal": { nombre: "Cuidado Personal", descripcion: "Todo para tu cuidado diario." },
    "bebes": { nombre: "Bebés", descripcion: "Productos para bebés y niños." },
    "perfumeria": { nombre: "Perfumería", descripcion: "Productos de perfumería y fragancias." },
    "higiene": { nombre: "Higiene", descripcion: "Productos para higiene y bienestar." }
};

const PRODUCTOS = [
    {
        nombre: "Shampoo",
        descripcion: "Shampoo para uso diario",
        imagen: "imagen/shampo.jpg",
        precioAnterior: 10000,
        precio: 9000,
        categorias: ["cuidado-personal", "higiene"]
    },
    {
        nombre: "Crema corporal",
        descripcion: "Hidratación para la piel",
        imagen: "imagen/crema.webp",
        precioAnterior: 6900,
        precio: 4200,
        categorias: ["skin-care", "dermocosmetica", "cuidado-personal"]
    },
    {
        nombre: "Pañales",
        descripcion: "Pañales para bebés",
        imagen: "imagen/pañales.webp",
        precioAnterior: 12500,
        precio: 10000,
        categorias: ["bebes"]
    },
    {
        nombre: "Jabón líquido",
        descripcion: "Higiene y cuidado personal",
        imagen: "imagen/jabon.webp",
        precioAnterior: 4500,
        precio: 3500,
        categorias: ["higiene", "cuidado-personal"]
    }
];
