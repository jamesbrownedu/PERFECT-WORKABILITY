let currentUser = null;

const authModal = document.getElementById('auth-modal');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authMsg = document.getElementById('auth-msg');

const appDiv = document.getElementById('app');
const logoutBtn = document.getElementById('logout-btn');

loginBtn.onclick = () => login();
signupBtn.onclick = () => signup();
logoutBtn.onclick = () => logout();

function login() {
  const users = getUsers();
  const user = users.find(u => u.username === usernameInput.value && u.password === hash(passwordInput.value));
  if (user) {
    currentUser = user;
    authModal.classList.add('hidden');
    appDiv.classList.remove('hidden');
    loadProfile();
    loadFeed();
  } else {
    authMsg.textContent = 'Invalid credentials';
  }
}

function signup() {
  const users = getUsers();
  if (users.find(u => u.username === usernameInput.value)) {
    authMsg.textContent = 'Username already taken';
    return;
  }
  const newUser = {
    username: usernameInput.value,
    password: hash(passwordInput.value),
    displayName: usernameInput.value,
    bio: '',
    profilePic: 'images/default.png',
    role: 'user',
    friends: [],
    dms: []
  };
  users.push(newUser);
  saveUsers(users);
  authMsg.textContent = 'Account created! Please login.';
}

function logout() {
  currentUser = null;
  appDiv.classList.add('hidden');
  authModal.classList.remove('hidden');
  usernameInput.value = '';
  passwordInput.value = '';
}

// Profile
function loadProfile() {
  document.getElementById('profile-pic').src = currentUser.profilePic;
  document.getElementById('display-name').textContent = currentUser.displayName;
  document.getElementById('bio').textContent = currentUser.bio;
}

// Feed
function loadFeed() {
  const postsDiv = document.getElementById('posts');
  postsDiv.innerHTML = '';
  const posts = getPosts();
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `
      <p><b>${post.username}</b>: ${post.desc}</p>
      <img src="${post.image}" width="200">
      ${canDelete(post.username) ? `<button onclick="deletePost('${post.id}')">Delete</button>` : ''}
    `;
    postsDiv.appendChild(postEl);
  });
}

// Check if user can delete post
function canDelete(postUser) {
  return currentUser.role === 'owner' || currentUser.role === 'mod' || currentUser.username === postUser;
}

// Upload
document.getElementById('upload-btn').onclick = () => {
  const fileInput = document.getElementById('image-upload');
  const desc = document.getElementById('image-desc').value;
  if (fileInput.files.length === 0) return alert('Select a file');
  const reader = new FileReader();
  reader.onload = function(e) {
    const posts = getPosts();
    posts.push({id: generateId(), username: currentUser.username, image: e.target.result, desc});
    savePosts(posts);
    loadFeed();
  };
  reader.readAsDataURL(fileInput.files[0]);
};

function deletePost(id) {
  let posts = getPosts();
  posts = posts.filter(p => p.id !== id);
  savePosts(posts);
  loadFeed();
}
