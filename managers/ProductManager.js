
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
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(data, null, 2)
    );
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

    //destructuramos lo que llega

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

      // validamos que lleguen los datos
      if (
        title === undefined ||
        description === undefined ||
        code === undefined ||
        price === undefined ||
        status === undefined ||
        stock === undefined ||
        category === undefined ||
        thumbnails === undefined
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

// METODO PUT 

  async updateProduct(pid, updateData) {
    const products = await this.leerData();
    const index = products.findIndex(p => p.id === pid);

    if (index === -1) {
      return null;
    }

    //destructuramos sin el id, esto lo tome de la IA que lo recoemndo
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



