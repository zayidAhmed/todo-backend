const BASE_URL = "https://todo-backend.onrender.com";

let token = null; // store JWT token after login

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
        document.getElementById('loginDiv').style.display = 'none';
        document.getElementById('registerDiv').style.display = 'none';
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
        body: JSON.stringify({ title: document.getElementById('todoInput').value })
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
        li.textContent = todo.title;
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
    document.getElementById('loginDiv').style.display = 'block';
    document.getElementById('registerDiv').style.display = 'block';
    document.getElementById('todoDiv').style.display = 'none';
});
