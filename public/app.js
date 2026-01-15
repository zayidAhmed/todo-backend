// Use relative path for API calls. This works for both localhost (http://localhost:5000)
// and production (https://your-app.onrender.com) because the frontend is served by the backend.
const BASE_URL = "";

let token = null; // store JWT token after login

// Load token from localStorage if it exists
const savedToken = localStorage.getItem('todoToken');
if (savedToken) {
    token = savedToken;
    loginDiv.style.display = 'none';
    registerDiv.style.display = 'none';
    document.getElementById('todoDiv').style.display = 'block';
    fetchTodos();
}



// ---------- Toggle login/register ----------
const loginDiv = document.getElementById('loginDiv');
const registerDiv = document.getElementById('registerDiv');

document.getElementById('showRegister').addEventListener('click', () => {
    loginDiv.style.display = 'none';
    registerDiv.style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', () => {
    registerDiv.style.display = 'none';
    loginDiv.style.display = 'block';
});


// ------------------- Register -------------------
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.getElementById('regUsername').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value
        })
    });
    const data = await res.json();
    alert(data.message || JSON.stringify(data));
});

// ------------------- Login -------------------
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        })
    });
    const data = await res.json();
    if (data.token) {
        token = data.token;
        // Save token in localStorage so it persists
        localStorage.setItem('todoToken', token);
        loginDiv.style.display = 'none';
        registerDiv.style.display = 'none';
        document.getElementById('todoDiv').style.display = 'block';
        fetchTodos();
    } else {
        alert(data.message || 'Login failed');
    }

});

// ------------------- Add To-Do -------------------
document.getElementById('todoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE_URL}/api/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: document.getElementById('todoInput').value })
    });
    const data = await res.json();
    document.getElementById('todoInput').value = '';
    fetchTodos();
});

// ------------------- Fetch To-Dos -------------------
async function fetchTodos() {
    const res = await fetch(`${BASE_URL}/api/todos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const todos = await res.json();
    const ul = document.getElementById('todoList');
    ul.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.onclick = async () => {
            await fetch(`${BASE_URL}/api/todos/${todo._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchTodos();
        };
        li.appendChild(del);
        ul.appendChild(li);
    });
}

// ------------------- Logout -------------------
document.getElementById('logoutBtn').addEventListener('click', () => {
    token = null;
    localStorage.removeItem('todoToken'); // clear stored token
    loginDiv.style.display = 'block';
    registerDiv.style.display = 'none';
    document.getElementById('todoDiv').style.display = 'none';
});

