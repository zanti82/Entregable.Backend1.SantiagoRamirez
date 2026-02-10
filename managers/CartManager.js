import fs from "fs";


export default class CartManager{

    constructor(path){
        this.path = path;
    }

    //funcion leer archivo carts.json

    async leerData(){

        try {

            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
            
        } catch (error) {
            return [];
            // el manejo de errores lo hacemos en el router
            
        }
    } 

    // funcion para escribir y guardar los datos carts.json

    async escribirData(data){

        const saveData = JSON.stringify(data, null, 2);

        await fs.promises.writeFile(this.path, saveData )

    }

    //creacion de un cart
    async crearCart(){

        const carts = await this.leerData();

        let newId;

        if(carts.length === 0){
           newId = 1
        }else{
            newId = carts.length + 1;
        }


        const newCart = {
            id : newId,
            products : [ ]

        }

        carts.push(newCart);

        await this.escribirData(carts);

        return newCart 
       

    }

    // anexar productos al cart

    async addProductsCart(idCart, pid, cantidad){
        //revisar que el cart exista

        const  carts = await this.leerData();
        const cartIndex = carts.findIndex(c => c.id === idCart);

        console.log(carts)

        if (cartIndex === -1){

            return null;

        } 

        const cart = carts[cartIndex]  //carro encontrado con su indice
        

        //revisar que el producto exista

        const productIndex = cart.products.findIndex(p => p.id === pid);

         
        if(productIndex === -1){

             // adiiconar el prod al cart
            cart.products.push({
                product: pid,
                cantidad : cantidad || 1
            })

        }else{
             // revisa si el prod existe , prud ++

            cart.products[productIndex].cantidad += (cantidad || 1)

        }

        carts[cartIndex] = cart;
        // guardar cart
        await this.escribirData(carts);
    
        return cart;      


    }

    // listar carro x id

    async getCart(idCart){

        const carts = await this.leerData();
        const cartExist = carts.find ( c => c.id === idCart );

        if(cartExist){
            return cartExist
        }else{
            return null
        }
        
    }



}