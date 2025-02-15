let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

async function initializeDB() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
}

initializeDB()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });

// 1
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2
async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.get(query, [id]);
  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let results = await fetchRestaurantById(req.params.id);
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3
async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    let results = await fetchRestaurantsByCuisine(req.params.cuisine);
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4
async function fetchRestaurantsByFilter(filters) {
  let query = 'SELECT * FROM restaurants WHERE 1=1';
  let params = [];
  if (filters.isVeg) {
    query += ' AND isVeg = ?';
    params.push(filters.isVeg);
  }
  if (filters.hasOutdoorSeating) {
    query += ' AND hasOutdoorSeating = ?';
    params.push(filters.hasOutdoorSeating);
  }
  if (filters.isLuxury) {
    query += ' AND isLuxury = ?';
    params.push(filters.isLuxury);
  }
  let response = await db.all(query, params);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  try {
    let results = await fetchRestaurantsByFilter(req.query);
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5
async function fetchRestaurantsSortedByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await fetchRestaurantsSortedByRating();
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7
async function fetchDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.get(query, [id]);
  return { dish: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let results = await fetchDishById(req.params.id);
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8
async function fetchDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  try {
    let results = await fetchDishesByFilter(req.query.isVeg);
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9
async function fetchDishesSortedByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price ASC';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await fetchDishesSortedByPrice();
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
