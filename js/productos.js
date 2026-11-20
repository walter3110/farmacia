// =====================================================================
//  CATÁLOGO DE LA FARMACIA
//  Todos los productos de la página salen de esta lista
//  (portada, carrusel de ofertas, páginas de categoría y carrito).
// =====================================================================


// ---------- Categorías (las del menú) ----------
const CATEGORIAS = {
    "ofertas": { nombre: "Ofertas", descripcion: "Los productos con descuento de esta semana." },
    "perfumeria": { nombre: "Perfumería", descripcion: "Productos de perfumería y fragancias." },
    "skin-care": { nombre: "Skin Care", descripcion: "Rutinas de limpieza, hidratación y cuidado de la piel." },
    "solares": { nombre: "Solares", descripcion: "Protección solar para toda la familia." },
    "maquillaje": { nombre: "Maquillaje", descripcion: "Bases, labiales, máscaras y más." },
    "dermocosmetica": { nombre: "Dermocosmética", descripcion: "Productos dermatológicos para cada tipo de piel." },
    "cuidado-personal": { nombre: "Cuidado Personal", descripcion: "Todo para tu cuidado diario." },
    "bebes": { nombre: "Bebés", descripcion: "Productos para bebés y niños." },
    "higiene": { nombre: "Higiene", descripcion: "Productos para higiene y bienestar." }
};


// ---------- Familias ----------
// El N° de artículo tiene 5 dígitos:  FF AAA
//   FF  = familia (2 dígitos, de esta lista)
//   AAA = artículo dentro de la familia (001 a 999)
// Ejemplo: "07001" = familia 07 (Bebés), artículo 001.
// Cada familia pertenece a una categoría: el producto aparece ahí automáticamente.
const FAMILIAS = {
    "01": "perfumeria",
    "02": "skin-care",
    "03": "solares",
    "04": "maquillaje",
    "05": "dermocosmetica",
    "06": "cuidado-personal",
    "07": "bebes",
    "08": "higiene"
};


// ---------- Productos ----------
// Para agregar uno, copiá un bloque { ... } y cambiá los datos.
//   articulo       5 dígitos, sin repetir (familia + artículo)
//   ean            código de barras del envase (opcional)
//   marca          marca del producto
//   nombre         nombre corto que se ve en la tarjeta
//   presentacion   tamaño o contenido: "400 ml", "90 g", "x38 unidades"
//   descripcion    una línea, se ve en la tarjeta
//   detalle        descripción completa (modo de uso, características, advertencias)
//   imagen         foto dentro de la carpeta imagen/
//   precio         precio actual, sin puntos
//   precioAnterior opcional: si es mayor que el precio, el producto entra en OFERTAS
//   categorias     opcional: otras categorías además de la de su familia
//   destacado      true = aparece en "Productos destacados" de la portada
//   carrusel       true = aparece en el carrusel "Ofertas para descubrir"
const PRODUCTOS = [
    {
        articulo: "06001",
        ean: "",
        marca: "",
        nombre: "Shampoo",
        presentacion: "",
        descripcion: "Shampoo para uso diario",
        detalle: "",
        imagen: "imagen/shampo.jpg",
        precio: 9000,
        precioAnterior: 10000,
        categorias: ["higiene"],
        destacado: true,
        carrusel: true
    },
    {
        articulo: "05001",
        ean: "",
        marca: "",
        nombre: "Crema corporal",
        presentacion: "",
        descripcion: "Hidratación para la piel",
        detalle: "",
        imagen: "imagen/crema.webp",
        precio: 4200,
        precioAnterior: 6900,
        categorias: ["skin-care", "cuidado-personal"],
        destacado: true,
        carrusel: true
    },
    {
        articulo: "07001",
        ean: "",
        marca: "Toddler",
        nombre: "Pañales",
        presentacion: "Talle G x38",
        descripcion: "Pañales para bebés",
        detalle: "",
        imagen: "imagen/pañales.webp",
        precio: 10000,
        precioAnterior: 12500,
        categorias: [],
        destacado: true,
        carrusel: true
    },
    {
        articulo: "08001",
        ean: "",
        marca: "Dove",
        nombre: "Jabón líquido",
        presentacion: "90 g",
        descripcion: "Higiene y cuidado personal",
        detalle: "",
        imagen: "imagen/jabon.webp",
        precio: 3500,
        precioAnterior: 4500,
        categorias: ["cuidado-personal"],
        destacado: true,
        carrusel: true
    }
];
