import { FormEvent, useEffect, useState } from 'react';
import './App.css';
import { json } from 'stream/consumers';
import { errorMonitor } from 'events';

const App = () => {

  type Note = {
    id: number;
    title: string
    content: string;
  }

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState <Note | null>(null);

  useEffect(() => {
    // creates an async function to call the api
    const getNotes = async () => {
      try {
        // logic to call the api
        // the fetch function does 'GET' BY default
        const response = await fetch("http://localhost:5000/api/notes")
        const notes: Note[] = await response.json();

        // update the state with the notes that were just fetched. 
        setNotes(notes);
      } 
      catch (error) {
        //catches any errors with the api
        console.log(error)
      }
    }

    getNotes();
  },[])

  const handleNoteClick = (note:Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }
  
  // resets the form
  const handleCancel  = () =>{
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  const handleUpdateNote = async (event: FormEvent) =>{
    event.preventDefault();
    if(!selectedNote)
    return;

    try {
      
      const response = await fetch(`http://localhost:5000/api/notes${selectedNote.id}`,
      {
        method: "PUT",
        // specifies that the data being sent are json objects
        headers:{"Content-type": "application/json"},
        body: JSON.stringify({title, content  })
      })

      const updatedNote = await response.json();
      const updatedNotesList = notes.map((note) => 
      note.id === selectedNote.id ? updatedNote : note
      )
      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } 
    
    catch (error) {
      console.log(error)
    }     
  };



  const handleAddNote = async (event: FormEvent) =>{
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/notes",
      {
        method: "POST",
        // specifies that the data being sent are json objects
        headers:{"Content-type": "application/json"},
        body: JSON.stringify({title, content}),
        
      });

      const newNote = await response.json();
      // Adds a new note by taking the new note object (newNote), coping the old note array (notes)
      // and adding the new note into the array.
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("")
    } 
    catch (error) {
      console.log(error);
    }
  }

  const handleDeleteNote = async (
    event: React.MouseEvent,
    noteId: number) => {
      event.stopPropagation();

      try {
        const response = await fetch(`http://localhost:5000/api/notes${noteId}`,
        {
          method: "DELETE"
        });
        
        const updatedNotes = notes.filter((note) => note.id !== noteId)
        setNotes(updatedNotes);
        
      } 
      catch (error) {
        console.log(error);
      }
  }
;

  return(
    
    <div className="app--container">

      <form className="notes--form" onSubmit={(e) => selectedNote ? handleUpdateNote(e) : handleAddNote(e)}>

        <input className="notes--title" placeholder="Title" required
                value={title} onChange={(e) => setTitle(e.target.value)}></input>
        <textarea className="notes--context" placeholder="Content" rows={10} required
                value={content} onChange={(e) => setContent(e.target.value)}></textarea>

        {selectedNote ? (
          <div className='notes--edit-buttons'>
            <button className="notes--button" id='save--button' type="submit">Save</button>
            <button className="notes--button" id='cancel--button' onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
            <button className="notes--button" type="submit">Add Note</button>          
        )}



      </form>
      <div className='notes--line'></div>
      <div className="notes--grid">
        {
          notes.map((note) => (

            <div className="notes--item"  onClick={() => handleNoteClick(note)}>
            <div className="notes--header">
              <button className="notes--delete-button" onClick={(e) => handleDeleteNote(e, note.id)}> X </button> 
            </div>
            <h6>ID:{note.id}</h6>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
          ))
        }

      </div>
    </div>
    
  );
}; 

export default App;
