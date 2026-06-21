const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.log(err));

const foodSchema = new mongoose.Schema({
    foodName: String,
    category: String,
    price: Number,
    quantity: Number,
    rating: Number
});

const Food = mongoose.model(
    "Food",
    foodSchema,
    "restaurant_menu"
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* =======================
   HOME PAGE
======================= */

app.get("/", async (req, res) => {

    const sort = req.query.sort;

    let foods;

    if(sort === "asc"){
        foods = await Food.find().sort({ price: 1 });
    }
    else if(sort === "desc"){
        foods = await Food.find().sort({ price: -1 });
    }
    else{
        foods = await Food.find();
    }

    res.render("index", { foods });
});

/* =======================
   ADD FOOD
======================= */

app.get("/add", (req, res) => {
    res.render("addFood");
});

app.post("/add", async (req, res) => {

    await Food.create(req.body);

    res.redirect("/");
});

/* =======================
   EDIT FOOD
======================= */

app.get("/edit/:id", async (req, res) => {

    const food = await Food.findById(req.params.id);

    res.render("editFood", { food });
});

app.post("/edit/:id", async (req, res) => {

    await Food.findByIdAndUpdate(
        req.params.id,
        req.body
    );

    res.redirect("/");
});

/* =======================
   DELETE FOOD
======================= */

app.post("/delete/:id", async (req, res) => {

    await Food.findByIdAndDelete(req.params.id);

    res.redirect("/");
});

/* =======================
   SEARCH FOOD
======================= */
app.get("/search", async (req, res) => {

    const keyword = req.query.keyword || "";

    const foods = await Food.find({
        foodName: {
            $regex: keyword,
            $options: "i"
        }
    });

    res.render("searchFood", {
        foods,
        keyword
    });
});

app.get("/", async (req, res) => {

    const sort = req.query.sort;

    let foods;

    if(sort === "asc"){
        foods = await Food.find().sort({ price: 1 });
    }
    else if(sort === "desc"){
        foods = await Food.find().sort({ price: -1 });
    }
    else{
        foods = await Food.find();
    }

    res.render("index", { foods });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});