//renderizar los productos

router.get("/", async (req,res)=>{

    const products = await productManager.getProducts()
   
    res.render("index", { products })
   
   })