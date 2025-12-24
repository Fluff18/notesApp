def test_create_note(client, auth_headers):
    response = client.post(
        "/notes",
        json={"title": "Test Note", "content": "This is a test note"},
        headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Note"
    assert data["content"] == "This is a test note"
    assert "id" in data
    assert "user_id" in data


def test_create_note_unauthorized(client):
    response = client.post(
        "/notes",
        json={"title": "Test Note", "content": "This is a test note"}
    )
    assert response.status_code == 403


def test_get_notes(client, auth_headers):
    # Create some notes
    client.post(
        "/notes",
        json={"title": "Note 1", "content": "Content 1"},
        headers=auth_headers
    )
    client.post(
        "/notes",
        json={"title": "Note 2", "content": "Content 2"},
        headers=auth_headers
    )
    
    response = client.get("/notes", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["title"] == "Note 1"
    assert data[1]["title"] == "Note 2"


def test_get_notes_unauthorized(client):
    response = client.get("/notes")
    assert response.status_code == 403


def test_update_note(client, auth_headers):
    # Create a note
    create_response = client.post(
        "/notes",
        json={"title": "Original Title", "content": "Original Content"},
        headers=auth_headers
    )
    note_id = create_response.json()["id"]
    
    # Update the note
    response = client.put(
        f"/notes/{note_id}",
        json={"title": "Updated Title", "content": "Updated Content"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["content"] == "Updated Content"


def test_update_note_partial(client, auth_headers):
    # Create a note
    create_response = client.post(
        "/notes",
        json={"title": "Original Title", "content": "Original Content"},
        headers=auth_headers
    )
    note_id = create_response.json()["id"]
    
    # Update only the title
    response = client.put(
        f"/notes/{note_id}",
        json={"title": "Updated Title"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["content"] == "Original Content"


def test_update_note_not_found(client, auth_headers):
    response = client.put(
        "/notes/999",
        json={"title": "Updated Title"},
        headers=auth_headers
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found"


def test_update_note_unauthorized(client, auth_headers):
    # Create a note
    create_response = client.post(
        "/notes",
        json={"title": "Original Title", "content": "Original Content"},
        headers=auth_headers
    )
    note_id = create_response.json()["id"]
    
    # Try to update without auth
    response = client.put(
        f"/notes/{note_id}",
        json={"title": "Updated Title"}
    )
    assert response.status_code == 403


def test_delete_note(client, auth_headers):
    # Create a note
    create_response = client.post(
        "/notes",
        json={"title": "To Delete", "content": "Will be deleted"},
        headers=auth_headers
    )
    note_id = create_response.json()["id"]
    
    # Delete the note
    response = client.delete(f"/notes/{note_id}", headers=auth_headers)
    assert response.status_code == 204
    
    # Verify it's deleted
    get_response = client.get("/notes", headers=auth_headers)
    assert len(get_response.json()) == 0


def test_delete_note_not_found(client, auth_headers):
    response = client.delete("/notes/999", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found"


def test_delete_note_unauthorized(client, auth_headers):
    # Create a note
    create_response = client.post(
        "/notes",
        json={"title": "To Delete", "content": "Will be deleted"},
        headers=auth_headers
    )
    note_id = create_response.json()["id"]
    
    # Try to delete without auth
    response = client.delete(f"/notes/{note_id}")
    assert response.status_code == 403


def test_note_ownership(client):
    # Create two users
    client.post(
        "/auth/signup",
        json={"email": "user1@example.com", "password": "password123"}
    )
    client.post(
        "/auth/signup",
        json={"email": "user2@example.com", "password": "password123"}
    )
    
    # Login as user1
    response1 = client.post(
        "/auth/login",
        json={"email": "user1@example.com", "password": "password123"}
    )
    user1_headers = {"Authorization": f"Bearer {response1.json()['access_token']}"}
    
    # Login as user2
    response2 = client.post(
        "/auth/login",
        json={"email": "user2@example.com", "password": "password123"}
    )
    user2_headers = {"Authorization": f"Bearer {response2.json()['access_token']}"}
    
    # User1 creates a note
    create_response = client.post(
        "/notes",
        json={"title": "User1 Note", "content": "User1 Content"},
        headers=user1_headers
    )
    note_id = create_response.json()["id"]
    
    # User2 tries to update user1's note
    update_response = client.put(
        f"/notes/{note_id}",
        json={"title": "Hacked"},
        headers=user2_headers
    )
    assert update_response.status_code == 403
    assert update_response.json()["detail"] == "Not authorized to update this note"
    
    # User2 tries to delete user1's note
    delete_response = client.delete(f"/notes/{note_id}", headers=user2_headers)
    assert delete_response.status_code == 403
    assert delete_response.json()["detail"] == "Not authorized to delete this note"
    
    # User2 should not see user1's notes
    get_response = client.get("/notes", headers=user2_headers)
    assert len(get_response.json()) == 0
