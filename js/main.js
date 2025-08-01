// ===== CORE BUSINESS LOGIC for Homepage =====
// نسخه جدید با پشتیبانی از دسته‌بندی

document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    
    async function fetchPosts() {
        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) {
                throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
            }
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error("خطا در بارگذاری posts.json:", error);
            postsContainer.innerHTML = '<p class="error">متاسفانه مشکلی در بارگذاری پست‌ها پیش آمده است. لطفاً کنسول (F12) را برای جزئیات فنی بررسی کنید.</p>';
        }
    }

    function displayPosts(posts) {
        postsContainer.innerHTML = '';

        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p>هنوز پستی منتشر نشده است!</p>';
            return;
        }

        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');

            // ساخت کارت پست با فیلد دسته‌بندی
            postCard.innerHTML = `
                <a href="post.html?id=${post.id}">
                    <img src="${post.image}" alt="${post.title}" class="post-card-image">
                </a>
                <div class="post-card-content">
                    <div class="post-card-category">${post.category}</div>
                    <h3>
                        <a href="post.html?id=${post.id}">${post.title}</a>
                    </h3>
                    <div class="post-card-meta">
                        <span>${post.author}</span> • <span>${post.date}</span>
                    </div>
                    <p class="post-card-summary">${post.summary}</p>
                    <a href="post.html?id=${post.id}" class="read-more">ادامه مطلب ←</a>
                </div>
            `;
            postsContainer.appendChild(postCard);
        });
    }

    fetchPosts();
});