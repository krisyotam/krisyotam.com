document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://kris-yotam.ghost.io/ghost/api/v3/content/posts/?key=55704fddcdb457f05e61b3aef2&include=tags&limit=500"; // Include tags
  const postsContainer = document.querySelector('main');
  const postsPerPage = 4; // Number of posts to display per page
  let currentPage = 1;
  let posts = []; // Store posts globally

  // Function to fetch posts from the API
  function fetchPosts() {
    console.log("Fetching posts from API...");
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data fetched successfully:", data);

        // Check if posts are available
        if (!data.posts || data.posts.length === 0) {
          console.error("No posts found in the data.");
          return;
        }

        // Filter posts to include only those with the tag #krisyotam.com
        posts = data.posts.filter(post => 
          post.tags.some(tag => tag.name === "#krisyotam.com")
        );

        // Sort posts by published_at in descending order
        posts = posts.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        // Log the tags of each post for debugging
        posts.forEach((post, index) => {
          console.log(`Post ${index + 1}:`, post.title);
          console.log("Tags:", post.tags); // Check if tags are included
        });
      })
      .catch(error => {
        console.error('Error fetching blog posts:', error);
      });
  }

  // Function to render posts on the current page
  function renderPosts() {
    // Clear the current posts
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
      console.error("No posts to render. Make sure the posts are fetched correctly.");
      return;
    }

    // Get the slice of posts for the current page
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToDisplay = posts.slice(start, end);

    // Loop through each post and add it to the page
    postsToDisplay.forEach(post => {
      const postElement = document.createElement('article');
      postElement.classList.add('blog-post');

      // Safely handle tags and category assignment
      const category = post.tags && post.tags.length > 0 ? post.tags[0].name : "Uncategorized";
      
      // Log to check if the category is correctly assigned
      console.log(`Post "${post.title}" category: ${category}`);
      
      const postData = {
        url: `/pages/html/post.html?post=${post.slug}`, // Adjusted the URL to go to the right page
        title: post.title,
        date: new Date(post.published_at).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        category: category,
        previewContent: post.excerpt,
      };

      postElement.innerHTML = `
        <h2><a href="${postData.url}">${postData.title}</a></h2>
        <div class="post-meta">
          <time>${postData.date}</time>
          <span>•</span>
          <span class="category">${postData.category}</span>
        </div>
        <p>${postData.previewContent}</p>
      `;

      postsContainer.appendChild(postElement);
    });
  }

  // Function to update the pagination display
  function updatePagination() {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const pageNumbersContainer = document.querySelector('.page-numbers');
    const nextPageButton = document.querySelector('.next-page');

    // Remove existing page links
    pageNumbersContainer.innerHTML = '';

    // Add page numbers dynamically
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = document.createElement('a');
      pageLink.href = '#';
      pageLink.textContent = i;

      // Set current page style
      if (i === currentPage) {
        pageLink.classList.add('current');
      }

      pageLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = i;
        renderPosts();
        updatePagination();
      });

      pageNumbersContainer.appendChild(pageLink);
    }

    // Add 'Next' button logic
    nextPageButton.disabled = currentPage >= totalPages;
    nextPageButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderPosts();
        updatePagination();
      }
    });
  }

  // Function to periodically refresh posts
  function startPolling(interval) {
    setInterval(() => {
      fetchPosts().then(() => {
        if (currentPage === 1) {
          renderPosts(); // Only refresh posts if on the first page
        }
        updatePagination();
      });
    }, interval);
  }

  // Initial load and polling setup
  fetchPosts().then(() => {
    renderPosts();
    updatePagination();
    startPolling(300000); // Poll every 5 minutes (300,000 ms)
  });
});
