import { FormEvent, useState } from 'react';
import './App.css';

const App = () => {

  type Note = {
    id: number;
    title: string
    content: string;
  }

  const [notes, setNotes] = useState<Note[]>(
    [
      {
        id: 1,
        title: "Note 1",
        content: "Note content 1",
      },
      {
        id: 2,
        title: "Note 2",
        content: "Note content 2",
      },
      {
        id: 3,
        title: "Note 3",
        content: "Note content 3",
      },
      {
        id: 4,
        title: "Note 4",
        content: "Note content 4",
      },
    ]
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState <Note | null>(null);

  const handleNoteClick = (note:Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  const handleUpdateNote = (event: FormEvent) =>{
    event.preventDefault();
    if(!selectedNote)
    return;
   
    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    }

    const updatedNotesList = notes.map((note) => 
      note.id === selectedNote.id ? updatedNote : note
      )

    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
     
  };

  // resets the form
  const handleCancel  = () =>{
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  const handleAddNote = (event: FormEvent) =>{
    event.preventDefault();
    
    const newNote: Note = {
    id: notes.length + 1,
    title: title,
    content: content,
  }
    /// Adds a new note by taking the new note object (newNote), coping the old note array (notes)
    /// and adding the new note into the array.
    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  }

  const handleDeleteNote = (
    event: React.MouseEvent,
    noteId: number) => {
      event.stopPropagation();
      // gets all the notes and returns all the notes that 
      const updatedNotes = notes.filter((note) => note.id !== noteId)
      setNotes(updatedNotes);
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
            <h2>{note.title} - ID:{note.id}</h2>
            <p>{note.content}</p>
          </div>
          ))
        }

      </div>
    </div>
    
  );
}; 

export default App;
