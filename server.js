// i will use the express framework to create a simple server
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Allows any origin to fetch from this API

//middleware to parse incoming requests bodies with JSON payloads
app.use(express.json());

// this is a simple server that will respond with  hello world when you visit the root url
app.get('/', (req, res) => {
  res.send('Hello World\n');
});
// MODIFICATION ICI : On ne lance le serveur QUE si le fichier est exécuté directement, pas pendant les tests
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

module.exports = app;

// using a simple list to store the data in memory 
// Mock Databases
let products = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Smartphone", price: 499 }
];

let orders = [
    { id: 1, productId: 1, quantity: 1 },
    { id: 2, productId: 2, quantity: 3 }
];

////////////////////////////////// implementing /products endpoints 

//1. GET /products - to get all products
app.get('/products' , (req, res)=> {
    res.json(products);
});

//2. GET /products/:id - to get a product by id
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) 
       //basic rending html page with a message
    // return res.status(404).send('product not found');
   // FIXED: returns uniform JSON error
    return res.status(404).json({ message: "Product not found" });
    res.json(product);
});

//3. POST /products - to create a new product
app.post('/products', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(newProduct);
    // classic version :  we return a 201 status code to indicate that a new resource has been created
// res.status(201).json(newProduct);
// for better rest compliance, we return the location of the newly created resource in the Location header
    res.status(201).location(`/products/${newProduct.id}`).json(newProduct);
});

//4. PATCH /products/:id - to update a product by id
app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.body.name) product.name = req.body.name;
    if (req.body.price) product.price = req.body.price;

    res.json({ message: "Product updated successfully", product });
});


//5. DELETE /products/:id - to delete a product by id
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).json({ message: "Product not found" });

    products.splice(productIndex, 1);
    res.json({ message: "Product deleted successfully" });
});
// 6. GET /products/:id/orders - Sub-resource endpoint (NEW REST RELATIONSHIP)
// fetches all orders belonging specifically to this product ID
app.get('/products/:id/orders', (req, res) => {
    const productId = parseInt(req.params.id);
    const productExists = products.some(p => p.id === productId);
    
    if (!productExists) return res.status(404).json({ error: "Product not found" });
    
    const productOrders = orders.filter(o => o.productId === productId);
    res.json(productOrders);
});
//////////////////////////////////// implementing /orders endpoints

//1. GET /orders - to get all orders
app.get('/orders', (req, res) => {
    res.json(orders);
});

//2 POST /orders - to create a new order
app.post('/orders', (req, res) => {
    const newOrder = {
        id: orders.length + 1,
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    orders.push(newOrder);
    res.status(201)
       .location(`/orders/${newOrder.id}`) // REST standard
       .json(newOrder);
});

//3. DELETE /orders/:id - to delete an order by id
app.delete('/orders/:id', (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (orderIndex === -1) return res.status(404).json({ message: "Order not found" });

    orders.splice(orderIndex, 1);
    res.json({ message: "Order deleted successfully" });
});

