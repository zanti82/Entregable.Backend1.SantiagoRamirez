import express from "express";
import productsRouter from "../src/routes/products.router.js";
import cartsRouter from "../src/routes/carts.router.js";
import handlebars from "express-handlebars";
import multer from "multer";
import path from "path";
import { Server } from "socket.io"
import viewsRouter from "./routes/views.router.js"
import ProductManager from './managers/ProductManager.js';



//************************** */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

//**********************
//  */
const app = express();
const PORT = 8080;
const productManager = new ProductManager('./src/data/products.json');

app.use(express.json()); // este me ayuda a convertir los datos de postman a objetos.
app.use(express.urlencoded({ extended: true }))
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter)
app.use((req, res, next) => {
  req.productManager = productManager;
  next();
});

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));
// También sirve uploads si lo necesitas
app.use('/uploads', express.static('uploads'));

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


const server = app.listen(PORT, () => {
  console.log(`"Servidor en puerto ${PORT}`)
});

//configuramos el socket
const io = new Server(server);

app.set("io", io)

// Hacemos que productManager sea accesible para los sockets
app.set("productManager", productManager);


//escuchamos las conexiones

io.on("connection", async (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  // Enviar productos al cliente cuando se conecta
  try {
    const products = await productManager.getProducts();
    console.log(`📦 Enviando ${products.length} productos a ${socket.id}`);
    socket.emit("updateProducts", products);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
  }

  socket.on("newProduct", async (product) => {
    console.log("📤 Recibido nuevo producto de", socket.id, product);
    
    try {
      // Agregar el producto
      const newProduct = await productManager.addProduct(product);
      console.log("✅ Producto agregado:", newProduct);
      
      // Obtener todos los productos actualizados
      const products = await productManager.getProducts();
      console.log(`📢 Emitiendo ${products.length} productos a todos los clientes`);
      
      // Emitir a TODOS (incluyendo el que envió)
      io.emit("updateProducts", products);
      
    } catch (error) {
      console.error("❌ Error al agregar producto:", error);
      socket.emit("error", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado:", socket.id);
  });
});