import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./data/carts.json");


/*
POST crear cart
*/
router.post("/", async (req, res) => {
    try {
      const newCart = await cartManager.crearCart(req.body);
      res.status(201).json(newCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  /*
PUT adicionar producto al cart
*/
router.put("/:cartID/products/:pId", async (req, res) => {


    try {
      const { cartID, pId } = req.params;
      const { quantity } = req.body;

      const updatedCart = await cartManager.addProductsCart(Number(cartID), pId,quantity);
      res.status(200).json(updatedCart);

      console.log(updatedCart)
      
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  /*
  GET cart por idCart
 */
router.get("/:idCart", async (req, res) => {
    const idCart = Number(req.params.idCart);
  
    try {
      const cart = await cartManager.getCart(idCart);
  
      if (!cart) {
        return res.status(404).json({ error: "carrito no encontrado" });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  export default router;