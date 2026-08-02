const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");

router.post("/", async (req, res) => {
  try {
    if (!req.body.products || req.body.products.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product",
      });
    }

    let totalAmount = 0;

    for (const item of req.body.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      ...req.body,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("products.product");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate(customer)
      .populate(products.product);
    if (!order) {
      return res.json(404).json({
        message: "Order not found",
      });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!req.body.products || req.body.products.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product",
      });
    }

    let totalAmount = 0;

    for (const item of req.body.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      totalAmount += product.price * item.quantity;
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        totalAmount,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("customer")
      .populate("products.product");

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
