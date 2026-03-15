import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();
const productManager = new ProductManager(
  path.join(__dirname, '../data/products.json')
);

/*
  GET /api/products
  Lista todos los productos
 */
router.get("/", async (req, res) => {
  try {
    const products = await req.productManager.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
  GET /api/products/:pid
 Obtiene un producto por ID
 */
router.get("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  try {
    const product = await req.productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
  POST /api/products
  Crea un nuevo producto
 */
router.post("/", async (req, res) => {
  try {
    const newProduct = await req.productManager.addProduct(req.body);
    const products = await req.productManager.getProducts();
    const io = req.app.get("io")

    console.log('Producto agregado, emitindo a todos...');
    console.log('Total productos:', products.length);
    
    io.emit("updateProducts", products);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/*
  PUT /api/products/:pid
 Actualiza un producto
 */
router.put("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  try {
    const updatedProduct = await req.productManager.updateProduct(pid, req.body);

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/*
  DELETE /api/products/:pid
  Elimina un producto
 */
router.delete("/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  try {
    const deleted = await req.productManager.deleteProduct(pid);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
