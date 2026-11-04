import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const bikes = [
  { brand: "Royal Enfield", model: "Classic 350", name: "Royal Enfield Classic 350", category: "Commuter", engine: 350, mileage: "80 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 600, securityDeposit: 5000, rating: 4.5, reviews: 128, location: "Delhi", image: "/images/bikes/classic-350.png", description: "A timeless classic design with reliable performance and comfortable riding position.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console", "Comfortable Seat"], available: true },
  { brand: "Royal Enfield", model: "Hunter 350", name: "Royal Enfield Hunter 350", category: "Cruiser", engine: 350, mileage: "75 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 650, securityDeposit: 5500, rating: 4.6, reviews: 95, location: "Mumbai", image: "/images/bikes/hunter-350.png", description: "Modern classic with contemporary design and smooth riding experience.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console", "Comfortable Seat", "Alloy Wheels"], available: true },
  { brand: "Royal Enfield", model: "Himalayan 450", name: "Royal Enfield Himalayan 450", category: "Adventure", engine: 452, mileage: "30 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 1200, securityDeposit: 8000, rating: 4.8, reviews: 212, location: "Bangalore", image: "/images/bikes/himalayan-450.png", description: "Adventure ready bike with rugged design and powerful engine for off-road exploration.", features: ["ABS", "Disc Brakes", "LED Lights", "GPS Compatible", "Comfortable Seat", "Long Travel Suspension"], available: true },
  { brand: "KTM", model: "Duke 390", name: "KTM Duke 390", category: "Sports", engine: 390, mileage: "40 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 1400, securityDeposit: 9000, rating: 4.7, reviews: 156, location: "Pune", image: "/images/bikes/duke-390.png", description: "Naked sport bike with aggressive styling and powerful acceleration.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console", "Sporty Design"], available: true },
  { brand: "KTM", model: "Duke 250", name: "KTM Duke 250", category: "Sports", engine: 250, mileage: "48 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 1000, securityDeposit: 7000, rating: 4.6, reviews: 189, location: "Hyderabad", image: "/images/bikes/duke-250.png", description: "Lightweight sports bike perfect for city riding and weekend getaways.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console"], available: true },
  { brand: "Yamaha", model: "R15 V4", name: "Yamaha R15 V4", category: "Sports", engine: 155, mileage: "50 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 900, securityDeposit: 6500, rating: 4.5, reviews: 167, location: "Chennai", image: "/images/bikes/r15-v4.png", description: "Compact sports bike with race-inspired design and exceptional handling.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console", "Aerodynamic Design"], available: true },
  { brand: "Yamaha", model: "MT-15", name: "Yamaha MT-15", category: "Commuter", engine: 155, mileage: "52 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 750, securityDeposit: 5500, rating: 4.4, reviews: 134, location: "Kolkata", image: "/images/bikes/mt-15.png", description: "Stylish naked commuter with comfortable ergonomics and reliable performance.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console"], available: true },
  { brand: "Kawasaki", model: "Ninja 300", name: "Kawasaki Ninja 300", category: "Sports", engine: 300, mileage: "35 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 1300, securityDeposit: 8500, rating: 4.7, reviews: 98, location: "Bangalore", image: "/images/bikes/ninja-300.png", description: "Entry-level sport bike with Kawasaki's legendary handling and reliability.", features: ["ABS", "Disc Brakes", "LED Lights", "Sporty Fairing"], available: true },
  { brand: "Bajaj", model: "Pulsar NS200", name: "Bajaj Pulsar NS200", category: "Commuter", engine: 200, mileage: "45 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 850, securityDeposit: 6000, rating: 4.3, reviews: 145, location: "Delhi", image: "/images/bikes/ns200.png", description: "Reliable commuter with good power delivery and fuel efficiency.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console"], available: true },
  { brand: "Bajaj", model: "Dominar 400", name: "Bajaj Dominar 400", category: "Cruiser", engine: 400, mileage: "32 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 1100, securityDeposit: 7500, rating: 4.6, reviews: 176, location: "Mumbai", image: "/images/bikes/dominar-400.png", description: "Premium cruiser with commanding presence and smooth power delivery.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console", "Comfortable Seat"], available: true },
  { brand: "Honda", model: "CB350", name: "Honda CB350", category: "Cruiser", engine: 350, mileage: "72 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 700, securityDeposit: 5200, rating: 4.5, reviews: 122, location: "Pune", image: "/images/bikes/cb350.png", description: "Retro classic design with Honda's reliability and smooth riding experience.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console", "Comfortable Seat"], available: true },
  { brand: "TVS", model: "Apache RTR 200", name: "TVS Apache RTR 200", category: "Commuter", engine: 200, mileage: "50 km/l", fuelType: "Petrol", transmission: "Manual", pricePerDay: 800, securityDeposit: 5800, rating: 4.4, reviews: 139, location: "Hyderabad", image: "/images/bikes/apache-rtr-200.png", description: "Performance commuter with sharp styling and responsive engine.", features: ["ABS", "Disc Brakes", "LED Lights", "Digital Console"], available: true },
];

const demoUsers = [
  { name: "Bikes Rental Service Admin", email: "admin@alimotorent.com", password: "admin123", phone: "", role: "ADMIN", status: "active" },
  { name: "Demo Rider", email: "user@alimotorent.com", password: "user123", phone: "+91 98765 43210", role: "USER", status: "active" },
];

const run = async () => {
  await connectDB();

  const shouldWipe = process.argv.includes("--fresh");
  if (shouldWipe) {
    await Promise.all([Booking.deleteMany({}), Payment.deleteMany({}), Bike.deleteMany({}), User.deleteMany({})]);
    console.log("Cleared existing bikes, users, bookings and payments.");
  }

  for (const demoUser of demoUsers) {
    // eslint-disable-next-line no-await-in-loop
    const existing = await User.findOne({ email: demoUser.email });
    if (!existing) {
      // eslint-disable-next-line no-await-in-loop
      await User.create(demoUser);
      console.log(`Created demo user: ${demoUser.email}`);
    }
  }

  const bikeCount = await Bike.countDocuments();
  if (bikeCount === 0) {
    await Bike.insertMany(bikes);
    console.log(`Inserted ${bikes.length} bikes.`);
  } else {
    console.log(`Bikes already exist (${bikeCount}), skipping catalogue insert.`);
  }

  console.log("Seeding complete.");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
