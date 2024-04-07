const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation
} = require('.');
const express = require('express');
const app = express();

app.use(express.json());

//routes

//fetch all customers
app.get('/api/customers', async(req, res, next) => {
    try {
        res.send(await fetchCustomers());
    } catch (error) {
        next(error);
    }
});

//fetch all restaurants
app.get('/api/restaurants', async(req, res, next) => {
    try {
        res.send(await fetchRestaurants());
    } catch (error) {
        next(error);
    }
});

//fetch all reservations
app.get('/api/reservations', async(req, res, next) => {
    try {
        res.send(await fetchReservations());
    } catch(error) {
        next(error);
    }
});

//add new reservation

app.post('/api/customers/:id/reservations', async(req, res, next) => {
    try {
        res.status(201).send(await createReservation(req.body));
    } catch (error) {
        next(error);
    }
});

//delete reservation
app.delete('/api/customers/:customer_id/reservations/:id', async(res, req, next) => {
    try {
        await destroyReservation(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

//error
app.use((error, req, res, next) => {
    res.status(res.status || 500).send({ error: error });
});


//init function

//init invocation