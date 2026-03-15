
const socket = io(); //abrimos el socket

socket.on('connect', () => {
    console.log('Conectado al servidor');
});


//escuchamos los cambios 
socket.on('updateProducts', (products) => {
    console.log('Productos actualizados:', products);
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    products.forEach(product => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <p>Stock: ${product.stock}</p>
        `;
        container.appendChild(div);
    });
});

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        code: document.getElementById('code').value,
        status: document.getElementById('status').checked,
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        thumbnails: document.getElementById('thumbnails').value || []
    };
    
    console.log('Enviando producto:', product); // PARA DEPURAR
    socket.emit('newProduct', product);
    e.target.reset();
});


 //enviamos los productos nuevos
 socket.emit("newProduct", product)