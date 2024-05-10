const express = require("express"); // Importera express för att skapa en server
const cors = require("cors"); // Importera cors för att hantera CORS-policy
const path = require('path') // Importera path för att arbeta med filvägar
const mongoose = require("mongoose"); // Importera mongoose för att ansluta till och interagera med MongoDB-databasen

const app = express(); // Skapa en Express-app
const port = process.env.PORT || 3002; // Ange porten för servern

app.use(cors()); // Använd cors för att tillåta korsdomänförfrågningar
app.use(express.json()); // Använd express.json() för att tolka JSON-data i förfrågningar

// Anslut till MongoDB-databasen med mongoose
mongoose.connect("mongodb://127.0.0.1:27017/cv").then(() => {
    console.log("connected"); // Logga anslutningsmeddelandet om anslutningen lyckades
}).catch(() => {
    console.log("error"); // Logga felmeddelandet om anslutningen misslyckades
})

// Skapa ett schema för arbetslivserfarenheter med mongoose
const cvSchema = new mongoose.Schema({
    companyname: { 
        type: String, 
        required : [ true, "På vilket företag jobbade du?"]
    },
    jobtitle: {
        type: String, 
        required:[ true, "Vad hade du för jobb titel?"]
    },
    location: {
        type: String,
        required: [ true, "I vilken stad jobbade du?"]
    }
});

const workexperience = mongoose.model("workexperience", cvSchema); // Skapa en modell baserad på schemat för arbetslivserfarenheter

// GET-endpoint för att hämta alla arbetslivserfarenheter
app.get("/workexperience", async (req, res) => {
    try {
        let result = await workexperience.find({}); // Hämta alla arbetslivserfarenheter från databasen
        return res.json(result); // Skicka resultatet som JSON
    } catch(error) {
        return res.status(500).json(error); // Hantera eventuella fel och skicka ett lämpligt felmeddelande
    }
});

// POST-endpoint för att lägga till ny arbetslivserfarenhet
app.post("/workexperience", async (req, res) => {
    try {
        let result = await workexperience.create(req.body); // Skapa en ny arbetslivserfarenhet baserad på inkommande data
        return res.json(result); // Skicka den nya arbetslivserfarenheten som JSON
    } catch(error) {
        return res.status(400).json(error); // Hantera eventuella fel och skicka ett lämpligt felmeddelande
    }
});

// PUT-endpoint för att uppdatera befintlig arbetslivserfarenhet
app.put("/workexperience/:id", async (req, res) => {
    try {
        let updatedExperience = await workexperience.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Uppdatera den befintliga arbetslivserfarenheten med den nya datan
        return res.json(updatedExperience); // Skicka den uppdaterade arbetslivserfarenheten som JSON
    } catch(error) {
        return res.status(400).json(error); // Hantera eventuella fel och skicka ett lämpligt felmeddelande
    }
});

// DELETE-endpoint för att ta bort arbetslivserfarenhet
app.delete("/workexperience/:id", async (req, res) => {
    try {
        await workexperience.findByIdAndDelete(req.params.id); // Ta bort arbetslivserfarenheten med den angivna ID:et
        return res.json({ message: "Arbetserfarenhet borttagen" }); // Skicka ett meddelande om att arbetslivserfarenheten har tagits bort
    } catch(error) {
        return res.status(400).json(error); // Hantera eventuella fel och skicka ett lämpligt felmeddelande
    }
});

// En enkel GET-endpoint för att visa ett välkomstmeddelande för API:et
app.get("/api", async (req, res) => {
    res.json({ message: "Welcome to this API" }); // Skicka ett välkomstmeddelande som JSON
});

// Lyssna på den angivna porten och logga ett meddelande när servern startar
app.listen(port, () => {
    console.log('server is running on port: ' + port)
});
