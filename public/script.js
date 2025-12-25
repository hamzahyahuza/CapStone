// ================================
// script.js
// Handles Add, Edit, Delete posts dynamically without reloading
// ================================

// Grab important DOM elements
const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("posts");
const editFormContainer = document.getElementById("editFormContainer");
const editForm = document.getElementById("editForm");

// ================================
// 1. Add a New Post
// ================================
postForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop page reload

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !content) {
    alert("⚠️ Please fill out both fields.");
    return;
  }

  try {
    const response = await fetch("/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();

    if (response.ok) {
      addPostToDOM(data.post); // Add to UI instantly
      postForm.reset(); // Clear form
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("❌ Error adding post.");
  }
});

// ================================
// 2. Show Edit Form
// ================================
function editPost(id, title, content) {
  document.getElementById("editId").value = id;
  document.getElementById("editTitle").value = title;
  document.getElementById("editContent").value = content;

  editFormContainer.style.display = "block";
}

// Cancel Edit
function cancelEdit() {
  editForm.reset();
  editFormContainer.style.display = "none";
}

// ================================
// 3. Update Post (PATCH)
// ================================
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editId").value;
  const title = document.getElementById("editTitle").value.trim();
  const content = document.getElementById("editContent").value.trim();

  const updateData = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;

  try {
    const response = await fetch(`/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (response.ok) {
      updatePostInDOM(data.post); // Update on page
      cancelEdit(); // Hide edit form
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("❌ Error updating post.");
  }
});

// ================================
// 4. Delete Post
// ================================
async function deletePost(id) {
  if (!confirm("🗑️ Are you sure you want to delete this post?")) return;

  try {
    const response = await fetch(`/posts/${id}`, { method: "DELETE" });
    const data = await response.json();

    if (response.ok) {
      removePostFromDOM(id);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("❌ Error deleting post.");
  }
}

// ================================
// 5. DOM Helpers (No Reload)
// ================================

// Add new post to the DOM
function addPostToDOM(post) {
  const postDiv = document.createElement("div");
  postDiv.className = "post";
  postDiv.id = `post-${post.id}`;
  postDiv.innerHTML = `
    <h3>${post.title}</h3>
    <p>${post.content}</p>
    <div class="meta">📅 ${new Date(post.createdAt).toLocaleDateString()} 
    ⏰ ${new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    <button onclick="editPost(${post.id}, '${escapeQuotes(post.title)}', '${escapeQuotes(post.content)}')">✏️ Edit</button>
    <button onclick="deletePost(${post.id})">🗑️ Delete</button>
  `;
  postsContainer.prepend(postDiv); // Add to TOP
}

// Update post content in DOM
function updatePostInDOM(post) {
  const postDiv = document.getElementById(`post-${post.id}`);
  if (postDiv) {
    postDiv.querySelector("h3").textContent = post.title;
    postDiv.querySelector("p").textContent = post.content;
  }
}

// Remove post from DOM
function removePostFromDOM(id) {
  const postDiv = document.getElementById(`post-${id}`);
  if (postDiv) postDiv.remove();
}

// Escape quotes to prevent breaking inline JS
function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}
