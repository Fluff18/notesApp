'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getNotes, createNote, updateNote, deleteNote, clearToken, isAuthenticated, Note } from '@/lib/api';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadNotes();
  }, [router]);

  const loadNotes = async () => {
    try {
      setError('');
      const data = await getNotes();
      setNotes(data);
    } catch (err: any) {
      if (err.status === 401) {
        clearToken();
        router.push('/login');
      } else {
        setError(err.message || 'Failed to load notes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setCreating(true);
    setError('');

    try {
      const newNote = await createNote(title, content);
      setNotes([...notes, newNote]);
      setTitle('');
      setContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to create note');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote) return;

    setError('');

    try {
      const updated = await updateNote(editingNote.id, editingNote.title, editingNote.content);
      setNotes(notes.map(note => note.id === updated.id ? updated : note));
      setEditingNote(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update note');
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    setError('');

    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete note');
    }
  };

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1>My Notes</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <div className="create-note-form">
          <h2>Add Note</h2>
          <form onSubmit={handleCreateNote}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={creating}
                placeholder="Enter note title"
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                disabled={creating}
                placeholder="Enter note content"
              />
            </div>
            <button type="submit" className="btn" disabled={creating}>
              {creating ? 'Adding Note...' : 'Add Note'}
            </button>
          </form>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet. Create your first note above!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <div className="note-actions">
                  <button
                    onClick={() => setEditingNote(note)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingNote && (
        <div className="modal-overlay" onClick={() => setEditingNote(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Note</h2>
            <div className="form-group">
              <label htmlFor="edit-title">Title</label>
              <input
                type="text"
                id="edit-title"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-content">Content</label>
              <textarea
                id="edit-content"
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setEditingNote(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleUpdateNote} className="btn">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
