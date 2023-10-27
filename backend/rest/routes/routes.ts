const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Productos
const productoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  logo: { type: String, required: true },
  date_release: { type: Date, required: true },
  date_revision: { type: Date, required: true },
});

const Producto = mongoose.model('producto', productoSchema);

router.get('/products', async (req: any, res: any) => {
  const searchText = req.query.searchText;

  try {
    let query = {};

    if (searchText) {
      const regex = new RegExp(searchText, "i");
      query = {
        $or: [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
          // { date_release: { $regex: regex } },
          // { date_revision: { $regex: regex } }
        ]
      };
    }

    const productos = await Producto.find(query);

    res.status(200).json(productos);
  } catch (error) {
    console.log(error, "error en router.get");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/products/verification', async (req: any, res: any) => {
  // const id = req.params.id;
  const params: any = req.query;
  if(params.id){
    const id = params.id;
    try {
      const producto = await Producto.findOne({ id });
      if (producto) {
        res.status(200).json(true);
      } else {
        res.status(200).json(false);
      }
    } catch (error) {
      console.log(error, "error en router.get verification");
      res.status(500).json({ error: "Internal server error" });
    }
  }
  else{
    res.status(206).json({ message: "ID not sent correctly" });
  }
});

router.post('/products', async (req: any, res: any) => {
  const productoData = req.body; 
  const missingFields: any = {};
  for (const field of ['id', 'name', 'description', 'logo', 'date_release', 'date_revision']) {
    if (!productoData[field]) {
      missingFields[field] = "No puede ser nulo";
    }
  }
  if (Object.keys(missingFields).length > 0) {
    res.status(206).json({ status: 206, ...missingFields});
  } else {
    try {
      const newProducto = new Producto(productoData);
      await newProducto.save();
      res.status(200).json({ message: "Product created successfully" });
    } catch (error) {
      console.log(error, "error en router.post");
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.put('/products/:id', async (req: any, res: any) => {
  const id = req.params.id;
  const updatedFields = req.body;
  const missingFields: any = {};
  for (const field of ['name', 'description', 'logo', 'date_release', 'date_revision']) {
    if (updatedFields[field] === undefined) {
      missingFields[field] = "No puede ser nulo";
    }
  }
  if (Object.keys(missingFields).length > 0) {
    res.status(206).json(missingFields);
  } else {
    try {
      const updatedProducto = await Producto.findOneAndUpdate({ id }, updatedFields, { new: true });
      if (updatedProducto) {
        res.status(200).json({ message: "Product updated successfully" });
      } else {
        res.status(404).json({ error: "No product found with that id" });
      }
    } catch (error) {
      console.log(error, "error en router.put");
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.delete('/products/:id', async (req: any, res: any) => {
  const id = req.params.id;
  try {
    const deletedProducto = await Producto.findOneAndDelete({ id });
    if (deletedProducto) {
      res.status(200).json({ message: "Product successfully removed" });
    } else {
      res.status(404).json({ message: "No product found with that id" });
    }
  } catch (error) {
    console.log(error, "error en router.delete");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;