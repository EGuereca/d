document.addEventListener("DOMContentLoaded", async () => {
    const productsContainer = document.getElementById("products-container");

    // Función para obtener productos
    async function fetchProducts() {
        try {
            const response = await fetch("http://localhost:3001/v1/api/products", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (!response.ok) throw new Error("Error al obtener productos");
            
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error(error);
        }
    }

    // Función para renderizar productos en el HTML
    function renderProducts(products) {
        productsContainer.innerHTML = "";
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "product-card";
            productCard.innerHTML = `
                <img src="${product.imagen}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <p>Precio: $${product.precio}</p>
                <input type="number" id="qty-${product.id}" value="1" min="1" max="5">
                <button onclick="addToOrder(${product.id})">Agregar</button>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Función para agregar un producto a la orden
    window.addToOrder = async (productId) => {
        const quantity = document.getElementById(`qty-${productId}`).value;
        const order_id = 1;
        try {
            const response = await fetch("http://localhost:3001/v1/api/orders/details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({order_id: 1, product_id: productId, quantity : quantity})
            });
            
            if (!response.ok) throw new Error("Error al agregar producto a la orden");
            
            alert("Producto agregado a la orden");
        } catch (error) {
            console.error(error);
        }
    };

    // Cargar productos al iniciar
    fetchProducts();
    });