import express from 'express';


// eslint-disable-next-line no-undef
const port = process.env.PORT ?? 3000;
const app = express();


app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto http://localhost/${port}`);
});