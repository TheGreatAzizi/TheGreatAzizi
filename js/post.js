// ===== CORE BUSINESS LOGIC for Single Post Page =====
// نسخه نهایی با قابلیت سئوی داینامیک، هایلایت کد و تزریق بنر تبلیغاتی

document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM ELEMENT SELECTION =====
    const postContentContainer = document.getElementById('post-content');

    // ===== URL PARAMETER HANDLING =====
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    // اگر شناسه‌ی پستی در URL وجود نداشته باشد، عملیات را متوقف کن
    if (!postId) {
        postContentContainer.innerHTML = '<p class="error">خطا: شناسه‌ی پست مشخص نشده است. <a href="index.html">بازگشت به صفحه اصلی</a></p>';
        console.error("Post ID is missing from the URL.");
        return;
    }
    
    /**
     * فانکشن اصلی برای گرفتن داده‌ها از JSON و نمایش پست
     */
    async function fetchAndDisplayPost() {
        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) {
                throw new Error(`خطای HTTP! وضعیت: ${response.status} - ${response.statusText}`);
            }
            
            const posts = await response.json();
            const post = posts.find(p => p.id === postId);

            if (post) {
                // مرحله ۱: تگ‌های سئو را قبل از نمایش محتوا پر می‌کنیم
                updateSeoTags(post);
                
                // مرحله ۲: محتوای پست (شامل بنر) را در صفحه نمایش می‌دهیم
                displayPost(post);
                
                // مرحله ۳: پس از قرار دادن محتوا در DOM، Prism را برای هایلایت کدها اجرا می‌کنیم
                Prism.highlightAll();
            } else {
                throw new Error(`پست با شناسه '${postId}' یافت نشد.`);
            }
        } catch (error) {
            console.error("خطا در بارگذاری و نمایش پست:", error);
            document.title = "پست یافت نشد | وبلاگ تحلیلی من";
            postContentContainer.innerHTML = `<p class="error">خطا: پست مورد نظر یافت نشد. ممکن است آدرس اشتباه باشد یا پست حذف شده باشد. <a href="index.html">بازگشت به صفحه اصلی</a></p>`;
        }
    }

    /**
     * تگ‌های متا برای سئو و شبکه‌های اجتماعی را به صورت داینامیک به‌روزرسانی می‌کند.
     * @param {object} post - آبجکت پست که از posts.json خوانده شده.
     */
    function updateSeoTags(post) {
        const pageUrl = window.location.href;
        // ساخت URL کامل برای تصویر، حتی اگر مسیر آن نسبی باشد
        const imageUrl = new URL(post.image, window.location.href).href;

        // تنظیم عنوان صفحه
        document.title = `${post.title} | وبلاگ تحلیلی من`;
        
        // تنظیم تگ‌های اصلی سئو
        document.getElementById('meta-description').setAttribute('content', post.summary);
        document.getElementById('canonical-url').setAttribute('href', pageUrl);
        
        // تنظیم تگ‌های Open Graph (برای فیسبوک، لینکدین، تلگرام و...)
        document.getElementById('og-title').setAttribute('content', post.title);
        document.getElementById('og-description').setAttribute('content', post.summary);
        document.getElementById('og-image').setAttribute('content', imageUrl);
        document.getElementById('og-url').setAttribute('content', pageUrl);
    }

    /**
     * محتوای کامل پست، شامل بنر تبلیغاتی را در صفحه نمایش می‌دهد.
     * @param {object} post - آبجکت پست.
     */
    function displayPost(post) {
        // ساخت HTML برای لیست تگ‌ها
        const tagsHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        // ===== BANNER HTML =====
        // کد بنر در یک متغیر جداگانه برای خوانایی بهتر تعریف شده است
        const bannerHTML = `
            <div class="daramet-embed-banner-container post-banner">
                <div class="daramet-embed-banner" id="1232">
                    <script src="https://daramet.com/embed/banner.js" async><\/script>
                </div>
            </div>
        `;

        // ساخت HTML کامل برای نمایش پست با استفاده از Template Literals
        postContentContainer.innerHTML = `
            <div class="post-full-header">
                <div class="post-full-category">${post.category}</div>
                <h1 class="post-full-title">${post.title}</h1>
                <div class="post-full-meta">
                    <span>${post.author}</span> • <span>${post.date}</span>
                </div>
            </div>
            
            <img src="${post.image}" alt="${post.title}" class="post-full-image">
            
            <!-- بنر تبلیغاتی در اینجا تزریق می‌شود -->
            ${bannerHTML} 
            
            <div class="post-full-content">
                ${post.content}
            </div>
            
            <div class="post-tags">
                <strong>برچسب‌ها:</strong>
                ${tagsHTML}
            </div>
        `;
    }

    // ===== INITIALIZATION =====
    // فراخوانی فانکشن اصلی برای شروع تمام عملیات
    fetchAndDisplayPost();
});
