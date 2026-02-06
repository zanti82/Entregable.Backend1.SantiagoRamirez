# Entregable.Backend1.SantiagoRamirez
Entrega 1 del proyecto express, donde se programa una API en JS con dos clases ProductManager y CartManager, que nos ayudan a crear un CRUD en un archivo JSON y ver los resultados en POSTMAN

La estuctura planteada esta de la siguente forma para llevar un control del codigo, esta estructura es muy similar a una API en java donde se tienes responsabilidades
separadas como Case Connection y las DAO, ademas de la clase de los Handler, para esta API usare este estructura:

src/
│
├── app.js               
│
├── routes/                
│   ├── products.router.js
│   └── carts.router.js
│
├── managers/               
│   ├── ProductManager.js
│   └── CartManager.js
│
├── data/
    ├── products.json
    └── carts.json

El servidor debe estar basado en Node.js y Express, y debe escuchar en el puerto 8080 . Se deben disponer dos grupos de rutas: /products y /carts

SE CREA EL .GITIGNORE PARA NO SUBIR MODULE AL REPOSITORIO


