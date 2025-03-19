const express = require("express");
const Alert = require("../models/alertModel");
const Car = require("../models/car");

const check= async (req, res) => {
  try {
    const { carId, newPrice } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    if (newPrice < car.price) {
      // Find users who wishlisted this car
      const alerts = await Alert.find({ carId });

      for (let alert of alerts) {
        alert.previousPrice = car.price;
        alert.newPrice = newPrice;
        alert.alertSent = true;
        await alert.save();
      }
    }

    car.price = newPrice;
    await car.save();

    res.status(200).json({ message: "Price updated, alerts sent if applicable" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {check};
