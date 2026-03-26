import { Router } from "express";
import CartModel from "../models/Cart.model.js";

const router = Router();

/*
POST crear carrito
*/
router.post("/", async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
GET carrito con populate
*/
router.get("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid)
      .populate("products.product");

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
POST agregar producto al carrito
*/
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);

    const productInCart = cart.products.find(
      p => p.product.toString() === req.params.pid
    );

    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({
        product: req.params.pid,
        quantity: 1
      });
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
PUT actualizar TODO el carrito
*/
router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;

    const cart = await CartModel.findByIdAndUpdate(
      req.params.cid,
      { products },
      { new: true }
    );

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
PUT actualizar cantidad de producto
*/
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await CartModel.findById(req.params.cid);

    const product = cart.products.find(
      p => p.product.toString() === req.params.pid
    );

    if (product) {
      product.quantity = quantity;
    }

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
DELETE eliminar producto del carrito
*/
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);

    cart.products = cart.products.filter(
      p => p.product.toString() !== req.params.pid
    );

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
DELETE vaciar carrito
*/
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);

    cart.products = [];

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;