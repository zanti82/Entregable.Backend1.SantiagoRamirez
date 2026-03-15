import express from "express";
import productsRouter from "../src/routes/products.router.js";
import cartsRouter from "../src/routes/carts.router.js";
import handlebars from "express-handlebars";
import multer from "multer";
import path from "path";
import { Server } from "socket.io"
import viewsRouter from "./routes/views.router.js"
import productManager from './managers/ProductManager.js';



//************************** */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

//**********************
//  */
const app = express();
const PORT = 8080;

app.use(express.json()); // este me ayuda a convertir los datos de postman a objetos.
app.use(express.urlencoded({ extended: true }))
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//inicializamos el handlebars y direccionamos views
app.engine('handlebars', handlebars.engine());
app.set("views", "./src/views");
app.set('view engine', 'handlebars');
//app.use(express.static(__dirname + '/views'));

// configuramos el multer para guardar y recirbi archivos

const storageConfig = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null, 'uploads')
    },

    filename:(req,file,cb)=>{
      cb(null, Date.now() + path.extname(file.originalname))
    } 
});

const upload = multer({storage:storageConfig});
app.post('/uploads', upload.single('file'), (req,res)=>{
    res.send("ela rchivo se ha subidlo ok")
} 
);

app.get('/', async(req, res)=>{

  try {
    // Obtenemos los productos del archivo
    const products = await productManager.getProducts();
    
    let testUser = {
        name: 'Coder',
        team: 'senior developer',
        products: products // Pasamos los productos a la vista
    };
    
    res.render('index', testUser);
} catch (error) {
    res.status(500).send('Error al cargar los productos');

}
}
);


const server = app.listen(8080, () => {
  console.log("Servidor en puerto 8080")
});

//configuramos el socket
const io = new Server(server);

app.set("io", io)

// Hacemos que productManager sea accesible para los sockets
app.set("productManager", productManager);


//escuchamos las conexiones

io.on("connection", async (socket) => {

  console.log("Cliente conectado")

  
    // Enviar productos al cliente cuando se conecta
    const products = await productManager.getProducts();
    socket.emit("updateProducts", products);
  
   socket.on("newProduct", async (product) => {

    const newProduct = await productManager.addProduct(product)

    const products = await productManager.getProducts()

    io.emit("updateProducts", products)
    

});
})
