
const socket = io(); //abrimos el socket


//escuchamos los cambios 
socket.on("updateProducts", (products)=>{

    const list = document.getElementById("productsList")

    list.innerHTML = ""

    products.forEach(p => {

        const li = document.createElement("li")

        li.textContent = `${p.title} - ${p.price}`

        list.appendChild(li)

    })

})

const form = document.getElementById("productForm")

form.addEventListener("submit", (e)=>{

    e.preventDefault()

    const formData = new FormData(form)

    const product = Object.fromEntries(formData)

    socket.emit("newProduct", product)

    form.reset()

})

 //enviamos los productos nuevos
 socket.emit("newProduct", product)