import express  from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// const { Prisma } = require('@prisma/client')
const app = express(); 

// creates a new prisma client
const prisma = new PrismaClient();

// parses the body from an API request into json so you don't have to do it manually. 
app.use(express.json());
app.use(cors());

// defining the endpoint to get notes
// "/api/notes" = the path to the API endpoint is where all the notes will be stored
// function = uses the Express response object to return some json
app.get("/api/notes", async (request, response)=> {

    //use prisma to pull data from the database
    //prisma = references the client that we are using
    //.note. = references the model that was just created
    // findMany() = returns everything in the model (going in note table, getting all the rows and returning every thing)
    const notes =  await prisma.note.findMany();

    response.json(notes)
})

// defining the endpoint to create notes 
// "/api/notes" = the path to the API endpoint is where all the notes will be stored
// 1) gets the title and content from the request body(the note info created by the user)
// 2) call the prisma client and use the 'create' function that is in the 'note' model
// 3) validations to catch empty fields and manage any prisma errors

app.post("/api/notes", async (request, response)=> {

    /*1*/ const {title, content} = request.body;
    /*3*/ if(!title){
        return(response.status(400).send("Note title is required"))
    }
    else if(!content){
        return(response.status(400).send("Note content is required"))
    }

    try {
    /*2 & 3*/ const note = await prisma.note.create({
                data: {title, content}, 
            });
            response.json(note);
        
    } catch (error) {
         return(response.status(400).send("Something went wrong...Oops"))
    }

})

// defining the endpoint to update notes 
// 1) gets the title and content from the user
// 2) gets the ID from the request params
// 3) validations to catch empty fields and manage any prisma errors
app.put("/api/notes:id", async (request, response)=>{
    /*1*/ const {title, content} = request.body;
    /*2*/ const id  = request.params.id;
    // const id = Prisma.ObjectID().toString()
    /*3*/ if(!title){
        return(response.status(400).send("Note title is required"))
    }
    else if(!content){
        return(response.status(400).send("Note content is required"))
    }
    else if(!id)
    {
        return(response.status(400).send("Note ID is required"))
    }

    /*3*/ try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content }
        });
            response.json(updatedNote);
        
        } catch (error) {
             return(response.status(500).send("Something went wrong...Oops"))
        }
});

// 2) gets the ID from the request params
// 3) validations to catch empty fields and manage any prisma errors
app.delete("/api/notes:id", async (request, response)=>{
    
    /*2*/ const id  = request.params.id;

    if(!id)
    {
        return(response.status(400).send("Note ID is required"))
    }
    /*3*/ try {
        await prisma.note.delete({
            where: { id }
        });
            response.status(204).send("Note was deleted :)");
        
        } catch (error) {
                return(response.status(500).send("Something went wrong...Oops"))
        }
})



// starts the server on whatever port I have defined, in this case, localhost:5000
// function is passed after the server starts to log a message to say that the server is running
app.listen(5000, () => {
    console.log("Server is running on localhost:5000 ^_^ ")
}) 