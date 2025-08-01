// ===== CORE BUSINESS LOGIC for Single Post Page =====

document.addEventListener('DOMContentLoaded', () => {
    const postContentContainer = document.getElementById('post-content');

    // گرفتن ID پست از پارامتر URL
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        postContentContainer.innerHTML = '<p class="error">خطا: شناسه‌ی پست مشخص نشده است. لطفاً به <a href="index.html">صفحه اصلی</a> بازگردید.</p>';
        return;
    }
    
    // فانکشن برای گرفتن و نمایش پست مشخص
    async function fetchAndDisplayPost() {
        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();
            
            // پیدا کردن پست مورد نظر با استفاده از ID
            const post = posts.find(p => p.id === postId);

            if (post) {
                displayPost(post);
            } else {
                throw new Error('پست مورد نظر یافت نشد.');
            }

        } catch (error) {
            console.error("خطا در بارگذاری پست:", error);
            postContentContainer.innerHTML = `<p class="error">خطا: پست مورد نظر یافت نشد. ممکن است آدرس اشتباه باشد یا پست حذف شده باشد. <a href="index.html">بازگشت به صفحه اصلی</a></p>`;
        }
    }

    // فانکشن برای نمایش محتوای کامل پست
    function displayPost(post) {
        // تنظیم عنوان صفحه
        document.title = post.title;

        // ساخت تگ‌ها
        const tagsHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // ساخت HTML کامل پست
        postContentContainer.innerHTML = `
            <div class="post-full-header">
                <h1 class="post-full-title">${post.title}</h1>
                <div class="post-full-meta">
                    <span>نویسنده: ${post.author}</span> | <span>تاریخ: ${post.date}</span>
                </div>
            </div>
            <img src="${post.image}" alt="${post.title}" class="post-full-image">
            <div class="post-full-content">
                ${post.content}
            </div>
            <div class="post-tags">
                <strong>برچسب‌ها:</strong>
                ${tagsHTML}
            </div>
        `;
    }

    // فراخوانی فانکشن اصلی
    fetchAndDisplayPost();
});