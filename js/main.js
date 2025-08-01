// ===== CORE BUSINESS LOGIC for Homepage =====

document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    
    // فانکشن برای گرفتن پست‌ها از فایل JSON
    async function fetchPosts() {
        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            displayPosts(posts);
        } catch (error) {
            console.error("خطا در گرفتن پست‌ها:", error);
            postsContainer.innerHTML = '<p class="error">متاسفانه مشکلی در بارگذاری پست‌ها پیش آمده است. لطفاً بعداً دوباره تلاش کنید.</p>';
        }
    }

    // فانکشن برای نمایش پست‌ها در صفحه
    function displayPosts(posts) {
        // حذف پیام "درحال بارگذاری"
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>هنوز پستی منتشر نشده است!</p>';
            return;
        }

        posts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');

            // ساخت کارت هر پست با استفاده از Template Literals
            postCard.innerHTML = `
                <a href="post.html?id=${post.id}">
                    <img src="${post.image}" alt="${post.title}" class="post-card-image">
                </a>
                <div class="post-card-content">
                    <h3>
                        <a href="post.html?id=${post.id}">${post.title}</a>
                    </h3>
                    <div class="post-card-meta">
                        <span>نویسنده: ${post.author}</span> | <span>تاریخ: ${post.date}</span>
                    </div>
                    <p class="post-card-summary">${post.summary}</p>
                    <a href="post.html?id=${post.id}" class="read-more">ادامه مطلب ←</a>
                </div>
            `;
            postsContainer.appendChild(postCard);
        });
    }

    // فراخوانی فانکشن اصلی
    fetchPosts();
});