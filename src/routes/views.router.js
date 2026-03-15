//renderizar los productos

import { Router } from "express";
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Creamos __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

// Le pasamos la ruta completa al ProductManager
const productManager = new ProductManager(
    path.join(__dirname, '../data/products.json')
);

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        
        res.render("index", {
            name: "Coder",
            team: "senior developer", 
            products: products
        });
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        
        res.render("realTimeProducts", {
            products: products
        });
    } catch (error) {
        res.status(500).send("Error al cargar los productos");
    }
})

export default router
