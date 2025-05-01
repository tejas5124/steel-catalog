const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key";

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MySQL Database Connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "manavsteel",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ensure Image Upload Directory Exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
ensureDirExists("uploads/images");

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: "uploads/images",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware for Authentication (JWT)
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token.replace("Bearer ", ""), SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.admin = decoded;
    next();
  });
};

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tejasgophane4142@gmail.com",
        pass: "lnsh jwpl muoc xifz",
    },
});

// Admin Registration
app.post("/admin/register", async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const [existingAdmins] = await db.query("SELECT * FROM admins WHERE username = ? OR email = ?", [username, email]);
    if (existingAdmins.length > 0) return res.status(400).json({ message: "Username or email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO admins (name, username, email, password) VALUES (?, ?, ?, ?)", [name, username, email, hashedPassword]);

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin Login
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [admins] = await db.query("SELECT * FROM admins WHERE username = ?", [username]);
    if (admins.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const admin = admins[0];
    if (!(await bcrypt.compare(password, admin.password))) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ admin_id: admin.id, username: admin.username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username, email: admin.email }, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch Admin Details
app.get("/admin/:id", authenticateToken, async (req, res) => {
  try {
    const [adminData] = await db.query("SELECT id, name, username, email FROM admins WHERE id = ?", [req.params.id]);
    if (adminData.length === 0) return res.status(404).json({ message: "Admin not found" });
    res.json(adminData[0]);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// CRUD for Products
app.post("/api/products", authenticateToken, upload.single("image"), async (req, res) => {
  const { name, category, grade, thickness, weight, price, location, manufacturer, certification, stock } = req.body;
  if (!req.file) return res.status(400).json({ message: "Image file is required" });

  try {
    await db.query(
      "INSERT INTO products (admin_id, name, category, grade, thickness, weight, price, location, manufacturer, certification, stock, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [req.admin.admin_id, name, category, grade, thickness, weight, price, location, manufacturer, certification, stock, req.file.filename]
    );
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error inserting product" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Product Route
app.put("/api/products/:id", authenticateToken, upload.single("image"), async (req, res) => {
  const productId = req.params.id;
  const { name, category, grade, thickness, weight, price, location, manufacturer, certification, stock } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const [existingProduct] = await db.query("SELECT * FROM products WHERE id = ?", [productId]);
    if (existingProduct.length === 0) return res.status(404).json({ message: "Product not found" });

    // Prepare the query to update the product
    let query = `
      UPDATE products
      SET name = ?, category = ?, grade = ?, thickness = ?, weight = ?, price = ?, location = ?, manufacturer = ?, certification = ?, stock = ?
    `;
    const values = [name, category, grade, thickness, weight, price, location, manufacturer, certification, stock];

    if (image) {
      // If a new image is uploaded, update the image as well
      const oldImagePath = `uploads/images/${existingProduct[0].image}`;
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath); // Remove old image if any
      query += ", image = ?";
      values.push(image);
    }

    query += " WHERE id = ?";

    // Execute the update query
    await db.query(query, [...values, productId]);

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  try {
    const [existingProduct] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (existingProduct.length === 0) return res.status(404).json({ message: "Product not found" });

    const imagePath = `uploads/images/${existingProduct[0].image}`;
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// Quotation Routes
const safeParseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch (err) {
    console.warn("Invalid JSON detected:", value);
    return []; // Return an empty array to prevent crashes
  }
};

app.get("/api/quotations", async (req, res) => {
  try {
    const [quotations] = await db.query("SELECT * FROM quotations");

    // Safely parse JSON fields for product-related data
    const formattedQuotations = quotations.map((quotation) => {
      return {
        ...quotation,
        product_ids: safeParseJSON(quotation.product_ids),
        product_names: safeParseJSON(quotation.product_names),
        prices: safeParseJSON(quotation.prices),
        quantities: safeParseJSON(quotation.quantities),
      };
    });

    // Add combined products (ID, Name, Price, and Quantity)
    const responseQuotations = formattedQuotations.map((quotation) => {
      const products = quotation.product_ids.map((id, index) => ({
        id,
        name: quotation.product_names[index],
        price: quotation.prices[index],
        quantity: quotation.quantities[index],
      }));

      // Return quotation with product details, email, and phone
      return {
        ...quotation,
        products,
        email: quotation.email,
        phone: quotation.phone,
      };
    });

    res.json(responseQuotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

app.post("/api/quotations", async (req, res) => {
  const { customer_name, email, phone, product_ids, product_names, prices, quantities, total_price, message } = req.body;

  if (!customer_name || !email || !phone || !product_ids || !product_names || !prices || !quantities || !total_price) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      // Ensure the fields are correctly stringified to JSON
      const productIdsJson = JSON.stringify(product_ids);
      const productNamesJson = JSON.stringify(product_names);
      const pricesJson = JSON.stringify(prices);
      const quantitiesJson = JSON.stringify(quantities);

      // Insert data into quotations table with is_confirmed explicitly set to 'No'
      await db.execute(
          "INSERT INTO quotations (customer_name, email, phone, product_ids, product_names, prices, quantities, total_price, message, status, is_confirmed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'No', NOW())",
          [
              customer_name,
              email,
              phone,
              productIdsJson,
              productNamesJson,
              pricesJson,
              quantitiesJson,
              total_price,
              message,
          ]
      );

      res.status(201).json({ message: "Quotation added successfully!" });
  } catch (error) {
      console.error("Error adding quotation:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// PUT route to approve a quotation
app.put("/api/quotations/:id/confirm", async (req, res) => {
  const { id } = req.params;
  const { is_confirmed } = req.body; // { is_confirmed: 'Yes' }

  try {
    // Update quotation status to 'confirmed'
    const [result] = await db.query(
      "UPDATE quotations SET is_confirmed = ? WHERE id = ?",
      [is_confirmed, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    res.json({ message: "Quotation approved successfully" });
  } catch (error) {
    console.error("Error approving quotation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// PUT route to update quotation status to 'rejected'
app.put("/api/quotations/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // { status: 'rejected' }

  try {
    // Update quotation status to 'rejected'
    const [result] = await db.query(
      "UPDATE quotations SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    res.json({ message: "Quotation rejected successfully" });
  } catch (error) {
    console.error("Error rejecting quotation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// DELETE route to remove a quotation by its ID
app.delete("/api/quotations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Delete quotation with the provided id
    const [result] = await db.query("DELETE FROM quotations WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    res.json({ message: "Quotation removed successfully" });
  } catch (error) {
    console.error("Error removing quotation:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


app.post("/api/send-email", async (req, res) => {
  const { customerEmail, customerName, products, totalPrice, quotationId } = req.body;

  if (!customerEmail || !customerName || !products || !totalPrice || !quotationId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: "Quotation Details - Manav Steel",
      html: `
        <h3>Hello ${customerName},</h3>
        <p>Here are the details of your quotation:</p>
        <p><strong>Products:</strong> ${products}</p>
        <p><strong>Total Price:</strong> ₹${totalPrice}</p>
        <p>Thank you for choosing Manav Steel!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Update email_sent status in database
    await db.execute("UPDATE quotations SET email_sent = 1 WHERE id = ?", [quotationId]);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
});


// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
