document.addEventListener('DOMContentLoaded', function() {
    initEventForm();
    loadEvents();
});

function initEventForm() {
    const form = document.getElementById('eventForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const date = document.getElementById('Date').value;
        const description = document.getElementById('Description').value;

        if (title && date && description) {
            await addEvent(title, date, description);
            form.reset();
            loadEvents();
        }
    });
}

async function addEvent(title, date, description) {
    const eventData = { title, date, description };

    try {
        const response = await fetch('/api/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            alert('Fehler beim Hinzufügen des Events. Bitte versuchen Sie es später erneut.');
        }
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Events', error);
    }
}

async function loadEvents() {
    try {
        const response = await fetch('/api/event', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const events = await response.json();
            displayEvents(events);
        } else {
            alert('Fehler beim Laden der Events. Bitte versuchen Sie es später erneut.');
        }
    } catch (error) {
        console.error('Fehler beim Laden der Events', error);
    }
}

function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    container.innerHTML = '';
    events.forEach(event => {
        container.appendChild(createEventElement(event));
    });
}

function createEventElement(event) {
    const eventElement = document.createElement('div');
    eventElement.classList.add('event-entry');

    const titleEl = document.createElement('strong');
    titleEl.textContent = event.title;
    const dateEl = document.createElement('em');
    const date = new Date(event.date).toISOString().split('T')[0];
    dateEl.textContent = date
    const descEl = document.createElement('p');
    descEl.textContent = event.description;
    descEl.style.display = 'none';

    const toggleDescButton = document.createElement('button');
    toggleDescButton.textContent = 'Beschreibung anzeigen/ausblenden';
    toggleDescButton.addEventListener('click', function() {
        descEl.style.display = descEl.style.display === 'none' ? 'block' : 'none';
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Bearbeiten';
    editButton.addEventListener('click', function() {
        editEvent(event.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Löschen';
    deleteButton.addEventListener('click', function() {
        deleteEvent(event.id);
    });

    eventElement.appendChild(titleEl);
    eventElement.appendChild(document.createTextNode(' ('));
    eventElement.appendChild(dateEl);
    eventElement.appendChild(document.createTextNode(') '));
    eventElement.appendChild(toggleDescButton); 
    eventElement.appendChild(descEl);
    eventElement.appendChild(editButton);
    eventElement.appendChild(deleteButton);

    return eventElement;
}

async function editEvent(eventId) {
    const newTitle = prompt('Neuer Event-Titel:');
    const newDate = prompt('Neues Datum (YYYY-MM-DD):');
    const newDescription = prompt('Neue Beschreibung:');
    if (newTitle && newDate && newDescription) {
        try {
            const response = await fetch(`/api/event/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title: newTitle, date: newDate, description: newDescription })
            });

            if (response.ok) {
                loadEvents();
            } else {
                alert('Fehler beim Bearbeiten des Events.');
            }
        } catch (error) {
            console.error('Fehler beim Bearbeiten des Events', error);
        }
    }
}

async function deleteEvent(eventId) {
    if (confirm('Sind Sie sicher, dass Sie dieses Event löschen möchten?')) {
        try {
            const response = await fetch(`/api/event/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                loadEvents();
            } else {
                alert('Fehler beim Löschen des Events.');
            }
        } catch (error) {
            console.error('Fehler beim Löschen des Events', error);
        }
    }
}
