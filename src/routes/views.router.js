import { Router } from "express";
import ProductModel from "../models/Product.model.js";
import CartModel from "../models/Cart.model.js";

const router = Router();

/*
Vista de productos con paginación
*/
router.get("/products", async (req, res) => {
  try {
    let { page = 1 } = req.query;

    page = parseInt(page);

    const result = await ProductModel.paginate({}, {
      limit: 10,
      page,
      lean: true
    });

    res.render("index", {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage
    });

  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

/*
Vista detalle producto
*/
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("productDetail", { product });

  } catch (error) {
    res.status(500).send("Error al cargar producto");
  }
});

/*
Vista carrito
*/
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", { cart });

  } catch (error) {
    res.status(500).send("Error al cargar carrito");
  }
});

export default router;