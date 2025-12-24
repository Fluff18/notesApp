import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import NotesPage from '@/app/notes/page';
import * as api from '@/lib/api';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/api');

const mockNotes = [
  {
    id: 1,
    title: 'Test Note 1',
    content: 'Content 1',
    user_id: 1,
    created_at: '2025-12-24T00:00:00Z',
  },
  {
    id: 2,
    title: 'Test Note 2',
    content: 'Content 2',
    user_id: 1,
    created_at: '2025-12-24T00:00:00Z',
  },
];

describe('NotesPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (api.isAuthenticated as jest.Mock).mockReturnValue(true);
    jest.clearAllMocks();
  });

  it('redirects to login if not authenticated', () => {
    (api.isAuthenticated as jest.Mock).mockReturnValue(false);

    render(<NotesPage />);

    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('loads and displays notes', async () => {
    (api.getNotes as jest.Mock).mockResolvedValue(mockNotes);

    render(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Test Note 2')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  it('displays empty state when no notes', async () => {
    (api.getNotes as jest.Mock).mockResolvedValue([]);

    render(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
    });
  });

  it('creates a new note', async () => {
    (api.getNotes as jest.Mock).mockResolvedValue([]);
    (api.createNote as jest.Mock).mockResolvedValue({
      id: 3,
      title: 'New Note',
      content: 'New Content',
      user_id: 1,
      created_at: '2025-12-24T00:00:00Z',
    });

    render(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Note' },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'New Content' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create note/i }));

    await waitFor(() => {
      expect(api.createNote).toHaveBeenCalledWith('New Note', 'New Content');
      expect(screen.getByText('New Note')).toBeInTheDocument();
      expect(screen.getByText('New Content')).toBeInTheDocument();
    });
  });

  it('deletes a note', async () => {
    (api.getNotes as jest.Mock).mockResolvedValue(mockNotes);
    (api.deleteNote as jest.Mock).mockResolvedValue(undefined);
    
    global.confirm = jest.fn(() => true);

    render(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.deleteNote).toHaveBeenCalledWith(1);
      expect(screen.queryByText('Test Note 1')).not.toBeInTheDocument();
    });
  });

  it('handles logout', async () => {
    (api.getNotes as jest.Mock).mockResolvedValue([]);
    (api.clearToken as jest.Mock).mockImplementation(() => {});

    render(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(api.clearToken).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('displays error message on API failure', async () => {
    (api.getNotes as jest.Mock).mockRejectedValue(new Error('Failed to load notes'));

    render(<NotesPage />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load notes/i)).toBeInTheDocument();
    });
  });
});
