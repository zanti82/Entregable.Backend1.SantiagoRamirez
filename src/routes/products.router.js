import { Router } from "express";
import ProductModel from "../models/Product.model.js";

const router = Router();

/*
GET /api/products
Paginación + filtros + sort
*/
router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    let filter = {};

    if (query) {
      if (query === "true" || query === "false") {
        filter.status = query === query === "true";
      } else {
        filter.category = query;
      }
    }

    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const result = await ProductModel.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true
    });

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
GET /api/products/:pid
*/
router.get("/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
POST /api/products
*/
router.post("/", async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);

    const io = req.app.get("io");
    const products = await ProductModel.find().lean();

    io.emit("updateProducts", products);

    res.status(201).json(newProduct);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/*
PUT /api/products/:pid
*/
router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updatedProduct);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/*
DELETE /api/products/:pid
*/
router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.pid);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;