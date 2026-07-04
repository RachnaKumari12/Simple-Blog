const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const publishBtn = document.getElementById("publishBtn");
const postsContainer = document.getElementById("posts");
const searchInput = document.getElementById("search");
const totalPosts = document.getElementById("totalPosts");
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let editIndex = -1;
function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}
function displayPosts(filter = "") {
    postsContainer.innerHTML = "";
    totalPosts.textContent = "📚 Total Posts: " + posts.length;
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(filter.toLowerCase()) ||
        post.content.toLowerCase().includes(filter.toLowerCase())
    );
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty">
                <h3>📭 No Posts Found</h3>
                <p>Create your first blog post.</p>
            </div>
        `;
        return;
    }
    filteredPosts.forEach(post => {
        const index = posts.findIndex(p => p.id === post.id);
        const card = document.createElement("div");
        card.className = "post";
        card.innerHTML = `
            <h2>${post.title}</h2>
            <small>📅 ${post.date}</small>
            <p>${post.content}</p>
            <div class="actions">
                <button class="edit"
                    onclick="editPost(${index})">
                    ✏️ Edit
                </button>
                <button class="delete"
                    onclick="deletePost(${index})">
                    🗑️ Delete
                </button>
            </div>
        `;
        postsContainer.appendChild(card);
    });
}
publishBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (title === "" || content === "") {
        alert("Please fill in both Title and Content.");
        return;
    }
    const date = new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    if (editIndex === -1) {
        posts.unshift({
            id: Date.now(),
            title: title,
            content: content,
            date: date
        });
    } else {
        posts[editIndex] = {
            id: posts[editIndex].id,
            title: title,
            content: content,
            date: date
        };
        editIndex = -1;
        publishBtn.textContent = "Publish Post";
    }
    savePosts();
    displayPosts(searchInput.value);
    titleInput.value = "";
    contentInput.value = "";
});
function editPost(index) {
    titleInput.value = posts[index].title;
    contentInput.value = posts[index].content;
    publishBtn.textContent = "Update Post";
    editIndex = index;
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function deletePost(index) {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
        posts.splice(index, 1);
        savePosts();
        displayPosts(searchInput.value);
    }
}
searchInput.addEventListener("input", () => {
    displayPosts(searchInput.value);
});
displayPosts();