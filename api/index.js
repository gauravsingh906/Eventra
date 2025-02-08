const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const TicketModel = require("./models/Ticket");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "bsbsfbrnsftentwnnwnwn";

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['https://go-gather.vercel.app'];

app.use(cors({
   origin: 'https://go-gather.vercel.app', // Allow only this domain
   credentials: true // Allow cookies if needed
 }));

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGO_URL)
   .then(() => console.log("MongoDB connected"))
   .catch((err) => console.error("MongoDB connection error:", err));

const upload = multer({ storage: multer.memoryStorage() });

// Middleware for Route Protection
const authenticateToken = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, jwtSecret, (err, userData) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = userData;
    next();
  });
};

app.get("/", (req, res) => {
  res.json("Welcome to Eventra API");
});

app.get("/createEvent", async (req, res) => {
   try {
      const events = await Event.find();
      res.status(200).json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events from MongoDB" });
   }
});



// User Registration
app.post("/register", async (req, res) => {
   const { name, email, password } = req.body;
   try {
      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
   } catch (e) {
      res.status(422).json(e);
   }
});

// User Login
app.post("/login", async (req, res) => {
   const { email, password } = req.body;
   const userDoc = await UserModel.findOne({ email });

   if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
   }

   const passOk = bcrypt.compareSync(password, userDoc.password);
   if (!passOk) {
      return res.status(401).json({ error: "Invalid password" });
   }

   jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
         if (err) {
            return res.status(500).json({ error: "Failed to generate token" });
         }
         res.cookie("token", token).json(userDoc);
      }
   );
});

// User Profile
app.get("/profile", authenticateToken, (req, res) => {
   const { token } = req.cookies;
   if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
         if (err) throw err;
         const { name, email, _id } = await UserModel.findById(userData.id);
         res.json({ name, email, _id });
      });
   } else {
      res.json(null);
   }
});

// Logout
app.post("/logout", authenticateToken, (req, res) => {
   res.cookie("token", "").json(true);
});

// Event Schema
const eventSchema = new mongoose.Schema({
   owner: String,
   title: String,
   description: String,
   organizedBy: String,
   eventDate: Date,
   eventTime: String,
   location: String,
   Participants: Number,
   Count: Number,
   Income: Number,
   ticketPrice: Number,
   Quantity: Number,
   image: String,
   likes: Number,
   Comment: [String],
});

const Event = mongoose.model("Event", eventSchema);

app.post("/createEvent", upload.single("image"), async (req, res) => {
   try {
      const eventData = req.body;

      if (req.file) {
         const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
               { resource_type: "image" },
               (error, result) => {
                  if (error) {
                     reject(error);
                  } else {
                     resolve(result);
                  }
               }
            );
            stream.end(req.file.buffer);
         });

         eventData.image = result.secure_url;
      } else {
         eventData.image = "";
      }

      const newEvent = new Event(eventData);
      await newEvent.save();
      res.status(201).json(newEvent);
   } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to create event" });
   }
});

app.get("/event/:id", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.post("/event/:eventId", (req, res) => {
   const eventId = req.params.eventId;

   Event.findById(eventId)
      .then((event) => {
         if (!event) {
            return res.status(404).json({ message: "Event not found" });
         }

         event.likes += 1;
         return event.save();
      })
      .then((updatedEvent) => {
         res.json(updatedEvent);
      })
      .catch((error) => {
         console.error("Error liking the event:", error);
         res.status(500).json({ message: "Server error" });
      });
});

app.get("/events", (req, res) => {
   Event.find()
      .then((events) => {
         res.json(events);
      })
      .catch((error) => {
         console.error("Error fetching events:", error);
         res.status(500).json({ message: "Server error" });
      });
});

app.get("/event/:id/ordersummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
   const { id } = req.params;
   try {
      const event = await Event.findById(id);
      res.json(event);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch event from MongoDB" });
   }
});

app.post("/tickets", async (req, res) => {
   try {
      const ticketDetails = req.body;
      console.log(ticketDetails, "iaf a")
      const newTicket = new TicketModel(ticketDetails);
      await newTicket.save();
      return res.status(201).json({ ticket: newTicket });
   } catch (error) {
      console.error("Error creating ticket:", error);
      return res.status(500).json({ error: "Failed to create ticket" });
   }
});

app.get("/tickets/:id", async (req, res) => {
   try {
      const tickets = await TicketModel.find();
      console.log(tickets)
      res.json(tickets);
   } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets" });
   }
});

app.get("/tickets/user/:userId", (req, res) => {
   const userId = req.params.userId;

   TicketModel.find({ userid: userId })
      .then((tickets) => {
         res.json(tickets);
      })
      .catch((error) => {
         console.error("Error fetching user tickets:", error);
         res.status(500).json({ error: "Failed to fetch user tickets" });
      });
});

app.delete("/tickets/:id", async (req, res) => {
   try {
      const ticketId = req.params.id;
      await TicketModel.findByIdAndDelete(ticketId);
      res.status(204).send();
   } catch (error) {
      console.error("Error deleting ticket:", error);
      res.status(500).json({ error: "Failed to delete ticket" });
   }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
