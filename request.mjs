import express from 'express';
import { getAllSizes, getElementsByType, getAllElements,
    createPoke,
    createOrder,
    getUserOrders,
    getOrderDetails} from './db.js'; 

const app = express();
const PORT = 3000;

app.use(express.json()); // ✅ deve venire PRIMA di tutte le rotte

app.get('/api/sizes/', async (req, res) => {
  try {
    const sizes = await getAllSizes(); 
    res.json(sizes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/elements/:type', async (req, res) => {
  try {
    const elements = await getElementsByType(req.params.type); 
    res.json(elements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }});

  app.get('/api/elements', async (req, res) => {
    try {
      const elements = await getAllElements();
      res.json(elements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * POST crea un nuovo poke bowl
   * Body JSON: { "sizeID": 1, "elementIDs": [1, 4, 9, 12] }
   */
  app.post('/api/pokes', async (req, res) => {
    const { sizeID, elementIDs } = req.body;
    try {
      const pokeID = await createPoke(sizeID, elementIDs);
      res.status(201).json({ pokeID });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * POST crea un nuovo ordine
   * Body JSON: { "userID": 1, "pokes": [{ "pokeID": 3, "quantity": 2 }], "totalPrice": 28 }
   */
  app.post('/api/orders', async (req, res) => {
    const { userID, pokes, totalPrice } = req.body;
    try {
      const orderID = await createOrder(userID, pokes, totalPrice);
      res.status(201).json({ orderID });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * GET lista ordini di un utente
   */
  app.get('/api/orders/user/:userID', async (req, res) => {
    try {
      const orders = await getUserOrders(req.params.userID);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  /**
   * GET dettagli di un ordine
   */
  app.get('/api/orders/:orderID', async (req, res) => {
    try {
      const details = await getOrderDetails(req.params.orderID);
      res.json(details);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}/`);
});
