// ===== CORE BUSINESS LOGIC for Single Post Page =====
// نسخه نهایی با قابلیت سئوی داینامیک و هایلایت کد

document.addEventListener('DOMContentLoaded', () => {
    const postContentContainer = document.getElementById('post-content');
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    if (!postId) {
        postContentContainer.innerHTML = '<p class="error">خطا: شناسه‌ی پست مشخص نشده است. <a href="index.html">بازگشت به صفحه اصلی</a></p>';
        return;
    }
    
    async function fetchAndDisplayPost() {
        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) {
                throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
            }
            const posts = await response.json();
            const post = posts.find(p => p.id === postId);

            if (post) {
                // مرحله ۱: تگ‌های سئو را قبل از نمایش محتوا پر می‌کنیم
                updateSeoTags(post);
                
                // مرحله ۲: محتوای پست را در صفحه نمایش می‌دهیم
                displayPost(post);
                
                // مرحله ۳: پس از قرار دادن محتوا در DOM، Prism را برای هایلایت کدها اجرا می‌کنیم
                Prism.highlightAll();
            } else {
                throw new Error(`پست با شناسه '${postId}' یافت نشد.`);
            }

        } catch (error) {
            console.error("خطا در بارگذاری پست:", error);
            document.title = "پست یافت نشد | وبلاگ تحلیلی من";
            postContentContainer.innerHTML = `<p class="error">خطا: پست مورد نظر یافت نشد. <a href="index.html">بازگشت به صفحه اصلی</a></p>`;
        }
    }

    /**
     * تگ‌های متا برای سئو و شبکه‌های اجتماعی را به صورت داینامیک به‌روزرسانی می‌کند
     * @param {object} post آبجکت پست که از posts.json خوانده شده
     */
    function updateSeoTags(post) {
        const pageUrl = window.location.href;
        const imageUrl = new URL(post.image, window.location.href).href;

        // تنظیم عنوان صفحه
        document.title = `${post.title} | وبلاگ تحلیلی من`;
        
        // تنظیم تگ‌های اصلی سئو
        document.getElementById('meta-description').setAttribute('content', post.summary);
        document.getElementById('canonical-url').setAttribute('href', pageUrl);
        
        // تنظیم تگ‌های Open Graph (برای فیسبوک، لینکدین و...)
        document.getElementById('og-title').setAttribute('content', post.title);
        document.getElementById('og-description').setAttribute('content', post.summary);
        document.getElementById('og-image').setAttribute('content', imageUrl);
        document.getElementById('og-url').setAttribute('content', pageUrl);
    }

    /**
     * محتوای کامل پست را در صفحه نمایش می‌دهد
     * @param {object} post آبجکت پست
     */
    function displayPost(post) {
        // ساخت HTML برای تگ‌ها
        const tagsHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // ساخت HTML کامل برای نمایش پست
        postContentContainer.innerHTML = `
            <div class="post-full-header">
                <div class="post-full-category">${post.category}</div>
                <h1 class="post-full-title">${post.title}</h1>
                <div class="post-full-meta">
                    <span>${post.author}</span> • <span>${post.date}</span>
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

    // فراخوانی فانکشن اصلی برای شروع عملیات
    fetchAndDisplayPost();
});
