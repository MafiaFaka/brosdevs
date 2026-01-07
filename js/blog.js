/* ============================================
   BROS DEVS - BLOG FUNCTIONALITY
   Handles blog listing and post rendering
   ============================================ */

/* ============================================
   NEXT UPDATE CONFIGURATION
   Set to null for "TBA" or use ISO date string
   Example: "2025-01-15T18:00:00Z" (UTC time)
   ============================================ */
const NEXT_UPDATE_DATE = null; // Set to null for "To Be Announced"

document.addEventListener('DOMContentLoaded', function () {
    // Determine which page we're on
    const isBlogListing = document.getElementById('blog-grid');
    const isPostPage = document.getElementById('post-content');

    if (isBlogListing) {
        loadBlogListing();
        initCountdown(); // Initialize countdown on blog listing page
    }

    if (isPostPage) {
        loadPost();
    }

    // Initialize navigation toggle
    initNavToggle();
});

/* ============================================
   COUNTDOWN TIMER
   ============================================ */
function initCountdown() {
    const countdownEl = document.getElementById('update-countdown');
    const timestampEl = document.getElementById('update-timestamp');
    const bannerEl = document.getElementById('next-update-banner');

    if (!countdownEl || !bannerEl) return;

    // If no date set, show TBA message
    if (!NEXT_UPDATE_DATE) {
        countdownEl.textContent = 'To Be Announced';
        countdownEl.classList.add('no-date');
        if (timestampEl) timestampEl.textContent = '';
        return;
    }

    const targetDate = new Date(NEXT_UPDATE_DATE);

    // Show local timestamp for user's timezone
    if (timestampEl) {
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        };
        timestampEl.textContent = targetDate.toLocaleString(undefined, options);
    }

    // Update countdown every second
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            // Update is live!
            countdownEl.textContent = '🎉 Update Live!';
            countdownEl.classList.add('live');
            return;
        }

        // Calculate time components
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format countdown string
        let countdownStr = '';
        if (days > 0) countdownStr += `${days}d `;
        if (hours > 0 || days > 0) countdownStr += `${hours}h `;
        countdownStr += `${minutes}m ${seconds}s`;

        countdownEl.textContent = countdownStr;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ============================================
   BLOG LISTING PAGE
   ============================================ */

// Embedded posts data (fallback for local file:// access)
const EMBEDDED_POSTS = [
    {
        "slug": "2024-12-30-bsm2-winter-update",
        "title": "Button Simulator Mania 2 - Winter Update!",
        "date": "2024-12-30",
        "game": "Button Simulator Mania 2",
        "thumbnail": "assets/button simulator mania 2.png",
        "author": "GhoulaxDev",
        "tags": ["update", "winter", "new-features"],
        "excerpt": "The winter update has arrived! New buttons, snowy worlds, and festive rewards await."
    },
    {
        "slug": "2024-12-15-bsm2-launch",
        "title": "Button Simulator Mania 2 is NOW LIVE!",
        "date": "2024-12-15",
        "game": "Button Simulator Mania 2",
        "thumbnail": "assets/button simulator mania 2.png",
        "author": "GhoulaxDev",
        "tags": ["launch", "announcement", "bsm2"],
        "excerpt": "We're thrilled to announce that Button Simulator Mania 2 is officially live on Roblox! Jump in and start clicking!"
    }
];

async function loadBlogListing() {
    const featuredContainer = document.getElementById('featured-post');
    const blogGrid = document.getElementById('blog-grid');
    let posts;

    try {
        // Try to fetch posts index
        const response = await fetch('posts/posts.json');
        if (!response.ok) throw new Error('Fetch failed');
        posts = await response.json();
    } catch (error) {
        console.log('Using embedded posts data (local mode)');
        posts = EMBEDDED_POSTS;
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Clear loading spinner
    blogGrid.innerHTML = '';

    // If no posts
    if (posts.length === 0) {
        if (featuredContainer) featuredContainer.innerHTML = '<p class="no-posts">No posts yet. Check back soon!</p>';
        return;
    }

    // Render featured (latest) post
    if (featuredContainer && posts.length > 0) {
        const latestPost = posts[0];
        featuredContainer.innerHTML = createFeaturedPostCard(latestPost);
    }

    // Render remaining posts in grid
    const olderPosts = posts.slice(1);
    if (olderPosts.length === 0) {
        // Hide "More Posts" section if no older posts
        const olderTitle = document.querySelector('.older-posts-title');
        if (olderTitle) olderTitle.style.display = 'none';
        blogGrid.style.display = 'none';
    } else {
        olderPosts.forEach(post => {
            const card = createPostCard(post);
            blogGrid.appendChild(card);
        });
    }
}

function createFeaturedPostCard(post) {
    const formattedDate = formatDate(post.date);
    return `
        <a href="post.html?slug=${post.slug}" class="featured-post">
            <div class="featured-post-image">
                <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
            </div>
            <div class="featured-post-content">
                <span class="featured-label">Latest Dev Blog</span>
                <h2 class="featured-post-title">${post.title}</h2>
                <p class="featured-post-excerpt">${post.excerpt || ''}</p>
                <span class="featured-read-btn">Read More <i class="fas fa-arrow-right"></i></span>
            </div>
        </a>
    `;
}

function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';

    const formattedDate = formatDate(post.date);

    card.innerHTML = `
        <a href="post.html?slug=${post.slug}" class="blog-card-link">
            <div class="blog-card-image">
                <img src="${post.thumbnail}" alt="${post.title}" loading="lazy">
                <div class="blog-card-overlay">
                    <span class="read-more">Read More <i class="fas fa-arrow-right"></i></span>
                </div>
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-card-game">
                        <i class="fas fa-gamepad"></i> ${post.game}
                    </span>
                    <span class="blog-card-date">
                        <i class="fas fa-calendar"></i> ${formattedDate}
                    </span>
                </div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt || ''}</p>
                <div class="blog-card-tags">
                    ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </a>
    `;

    return card;
}

/* ============================================
   INDIVIDUAL POST PAGE
   ============================================ */

// Embedded post content (fallback for local file:// access)
const EMBEDDED_POSTS_CONTENT = {
    "2024-12-30-bsm2-winter-update": `---
title: Button Simulator Mania 2 - Winter Update!
date: 2024-12-30
game: Button Simulator Mania 2
thumbnail: assets/button simulator mania 2.png
author: GhoulaxDev
tags: update, winter, new-features
---

# ❄️ Winter Update is Here!

The winter update has arrived in Button Simulator Mania 2! Get ready for new buttons, snowy worlds, and festive rewards.

---

## ⭐ New Features

### 🌨️ Winter World
Explore the brand new Winter World with snow-covered buttons and icy landscapes!

### 🎁 Gift Boxes
Collect Gift Boxes scattered across all worlds for special winter rewards.

### ❄️ Snowflake Currency
A new limited-time currency for the winter event shop!

---

## 🔧 Bug Fixes
- Fixed button spawning issues in World 3
- Resolved lag when opening multiple buttons
- Fixed visual glitches with certain pets

---

## ⚖️ Balance Changes
- Increased coin rewards by 25%
- Buffed all winter pets
- Reduced prestige requirements

---

## 🎁 Winter Event

### ☃️ Snowman Boss
A new boss spawns every hour! Defeat it for exclusive winter pets.

**Event Rewards:**
- ❄️ Huge Snowflake Dragon
- ⛄ Snowman Pet
- 🎿 Winter Hoverboard

---

*Happy Holidays from the Ghoulax Team!*`
};

async function loadPost() {
    const postHeader = document.getElementById('post-header');
    const postContent = document.getElementById('post-content');

    // Get slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        showError(postHeader, postContent, 'Post not found');
        return;
    }

    let markdown;

    try {
        // Try to fetch the markdown file
        const mdResponse = await fetch(`posts/${slug}.md`);
        if (!mdResponse.ok) throw new Error('Fetch failed');
        markdown = await mdResponse.text();
    } catch (error) {
        // Fallback to embedded post content for local file:// access
        console.log('Using embedded post data (local mode)');
        if (EMBEDDED_POSTS_CONTENT[slug]) {
            markdown = EMBEDDED_POSTS_CONTENT[slug];
        } else {
            showError(postHeader, postContent, 'Post not found');
            return;
        }
    }

    // Parse frontmatter and content
    const { frontmatter, content } = parseMarkdown(markdown);

    // Update page title
    document.title = `${frontmatter.title} | Ghoulax Studio's`;

    // Render header
    postHeader.innerHTML = renderPostHeader(frontmatter);

    // Render content using marked.js
    postContent.innerHTML = marked.parse(content);

    // Add image lightbox functionality
    addImageLightbox();
}

function parseMarkdown(markdown) {
    // Check for YAML frontmatter
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);

    if (!match) {
        return { frontmatter: {}, content: markdown };
    }

    // Parse frontmatter
    const frontmatterStr = match[1];
    const content = match[2];
    const frontmatter = {};

    frontmatterStr.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();

            // Handle arrays (tags)
            if (value.includes(',')) {
                value = value.split(',').map(v => v.trim());
            }

            frontmatter[key] = value;
        }
    });

    return { frontmatter, content };
}

function renderPostHeader(frontmatter) {
    const formattedDate = formatDate(frontmatter.date);
    const tags = Array.isArray(frontmatter.tags)
        ? frontmatter.tags
        : (frontmatter.tags || '').split(',').map(t => t.trim());

    return `
        <div class="post-meta-top">
            <a href="index.html#games" class="post-game-link">
                <i class="fas fa-gamepad"></i> ${frontmatter.game || 'General'}
            </a>
            <span class="post-date">
                <i class="fas fa-calendar"></i> ${formattedDate}
            </span>
            <span class="post-author">
                <i class="fas fa-user"></i> ${frontmatter.author || 'Ghoulax Team'}
            </span>
        </div>
        <h1 class="post-title">${frontmatter.title}</h1>
        <div class="post-tags">
            ${tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
        </div>
        ${frontmatter.thumbnail ? `
            <div class="post-thumbnail">
                <img src="${frontmatter.thumbnail}" alt="${frontmatter.title}" loading="lazy">
            </div>
        ` : ''}
    `;
}

function showError(postHeader, postContent, message) {
    postHeader.innerHTML = `<h1 class="post-title">Post Not Found</h1>`;
    postContent.innerHTML = `
        <p class="error-message">${message}</p>
        <a href="blog.html" class="btn btn-primary">
            <i class="fas fa-arrow-left"></i> Back to Blog
        </a>
    `;
}

/* ============================================
   IMAGE LIGHTBOX
   ============================================ */
function addImageLightbox() {
    const images = document.querySelectorAll('.post-content img');

    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function () {
            openLightbox(this.src, this.alt);
        });
    });
}

function openLightbox(src, alt) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <div class="lightbox-content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox-close">&times;</button>
        </div>
    `;

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay || e.target.classList.contains('lightbox-close')) {
            overlay.remove();
        }
    });

    document.body.appendChild(overlay);
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function initNavToggle() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}
