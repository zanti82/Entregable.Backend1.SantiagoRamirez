import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

/*
  GET /api/products
  Lista todos los productos
 */
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
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
    const product = await productManager.getProductById(pid);

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
    const newProduct = await productManager.addProduct(req.body);
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
    const updatedProduct = await productManager.updateProduct(pid, req.body);

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
    const deleted = await productManager.deleteProduct(pid);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
