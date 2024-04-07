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
} = require('./db');
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
const init = async ()=> {
    await client.connect();
    console.log('Connected to database.');
    await createTables();
    console.log('Tables created.');
    const [Lauren, Arnold, Grace, Fiola, Oyamel, Rania, Cranes] = await Promise.all([
        createCustomer('Lauren'),
        createCustomer('Arnold'),
        createCustomer('Grace'),
        createRestaurant('Fiola'),
        createRestaurant('Oyamel'),
        createRestaurant('Rania'),
        createRestaurant('Cranes')
    ]);
    console.log(`Lauren has an id of ${Lauren.id}.`);
    console.log(`Fiola has an id of ${Fiola.id}. `);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
    await Promise.all([
        createReservation({date: '05/30/2024', party_count: 5, restaurant_id: Oyamel.id, customer_id: Lauren.id}),
        createReservation({date: '04/25/2024', party_count: 2, restaurant_id: Fiola.id, customer_id: Arnold.id}),
        createReservation({date: '06/11/2024', party_count: 4, restaurant_id: Cranes.id, customer_id: Lauren.id}),
        createReservation({date: '05/13/2024', party_count: 8, restaurant_id: Rania.id, customer_id: Grace.id}),
        createReservation({date: '07/16/2024', party_count: 3, restaurant_id: Oyamel.id, customer_id: Grace.id})
    ]);
    const reservations = await fetchReservations();
    console.log(reservations);
    await destroyReservation(reservations[0].id);
    console.log(await fetchReservations());

    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
};

//init invocation
init ();