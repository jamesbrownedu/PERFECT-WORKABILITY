// Simple hash function for passwords (not for production)
function hash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

// Generate unique IDs
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
