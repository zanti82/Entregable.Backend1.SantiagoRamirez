
// IMPORTAMOS EL FS PARA ARCHIVOS

import fs from "fs"; 

// EXPORTAMOS PARA PODER USAR LA CLASE DESPUES

export default class ProductManager {
  
    // el constructor recibe solo el path por parametro y usa los metodos que tenemos
    constructor(path) {
    this.path = path;
  }

  //METODOS PARA ACTULIZAR EL ARCHIVO JSON

  async leerData(){
    try {
        const data = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(data)
        
    } catch (error) {
         
        return [];
        // el manejo de errores lo hacemos en el router
        
    }
  }

  async escribirData(data) {
    const saveData = JSON.stringify(data, null, 2);
    
        await fs.promises.writeFile(
          this.path,saveData);
  }

  async getProducts() {
    return await this.leerData(); //devuelve productos 
  }

  async getProductById(pid) {
    const products = await this.leerData();
    return products.find(p => p.id === pid) || null; //solo retrna dos valores null s no esta o el producto
  }
    
    // el el objeto DATA  viene del router condo la reciba, aca solo la adiciona

// METODO POST

 async addProduct(data){

    
       const title = data.title;
       const description = data.description;
       const code = data.code;
       const price = data.price;
       const status = data.status;
       const stock = data.stock;
       const category = data.category;
       const thumbnails = data.thumbnails;
  


    /*destructuramos lo que llega

    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      } = data;
 */

      // validamos que lleguen los datos
      if ( title === undefined || description === undefined || code === undefined || price === undefined ||
        status === undefined || stock === undefined || category === undefined ||  thumbnails === undefined
      ) {
        throw new Error("Todos los campos son obligatorios");
      }

      // si todo esto pasa, hay que llamar el archivo json para compara el code

      const products = await this.leerData();

    const codeExists = products.find(p => p.code === code);
    if (codeExists) {
      throw new Error("El código del producto ya existe");
    }

    // para asignar el id al producto que se va a crear, lo hacemos contando cuantos productos hay
    // y asignamos el last id +1

    let newId;
    if(products.length === 0){
        newId = 1;
    }else{
        newId = products.length + 1
    }

    const newProduct = {
    id : newId,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,              
    thumbnails           
    };
     
  products.push(newProduct);
  await this.escribirData(products);

  return newProduct;
  }

// METODO PUT update

  async updateProduct(pid, updateData) {
    const products = await this.leerData();
    const index = products.findIndex(p => p.id === pid);

    if (index === -1) {
      return null;
    }

    /*
    const jsonProduct = products[index];

    const updatedProduct = {
        id: jsonProduct.id, // El ID se queda igual pase lo que pase
        title: updateData.title !== undefined ? updateData.title : jsonProduct.title,
        description: updateData.description !== undefined ? updateData.description : jsonProduct.description,
        code: updateData.code !== undefined ? updateData.code : jsonProduct.code,
        price: updateData.price !== undefined ? updateData.price : jsonProduct.price,
        status: updateData.status !== undefined ? updateData.status : jsonProduct.status,
        stock: updateData.stock !== undefined ? updateData.stock : jsonProduct.stock,
        category: updateData.category !== undefined ? updateData.category : jsonProduct.category,
        thumbnails: updateData.thumbnails !== undefined ? updateData.thumbnails : jsonProduct.thumbnails
    };

    products[index] = updatedProduct;
    */

    //destructuramos sin el id, usando el objeto rest
    const { id, ...rest } = updateData;

    products[index] = {
      ...products[index],
      ...rest
    };

    await this.escribirData(products);
    return products[index];
  }

  async deleteProduct(pid) {
    const products = await this.leerData();
    const filteredProducts = products.filter(p => p.id !== pid);

    if (products.length === filteredProducts.length) {
      return null;
    }

    await this.escribirData(filteredProducts);
    return true;
  }
}



