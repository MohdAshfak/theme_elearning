/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

publicWidget.registry.OdooElearningHeader = publicWidget.Widget.extend({
    selector: 'header.foodmart-header, header',
    
    /**
     * @override
     */
    start: function () {
        const result = this._super.apply(this, arguments);
        
        // DOM is ready when start() is called
        // Execute DOM manipulation - functions safely check for element existence
        this._moveOdooElements();
        this._copyMenuItems();
        this._initMobileSearch();
        this._initScrollAnimations();
        this._initHeroCarousel();
        this._initTestimonialCarousel();
        
        return result;
    },

    /**
     * Move Odoo's user menu and cart to our custom header location
     */
    _moveOdooElements: function() {
        // Move user menu if it exists in default location
        const $originalUserMenu = $('.o_user_menu').not('#user_menu_placeholder .o_user_menu');
        const $userMenuPlaceholder = $('#user_menu_placeholder');
        
        if ($originalUserMenu.length && $userMenuPlaceholder.length && $userMenuPlaceholder.children().length === 0) {
            $originalUserMenu.detach();
            $userMenuPlaceholder.replaceWith($originalUserMenu);
            $originalUserMenu.css({
                'list-style': 'none',
                'margin': '0',
                'padding': '0'
            });
        }
        
        // Style user menu to match our design
        $('.o_user_menu > a, .o_user_menu > button, .o_user_menu .dropdown-toggle').each(function() {
            const $el = $(this);
            if (!$el.hasClass('rounded-circle')) {
                $el.addClass('rounded-circle bg-light p-2 mx-1');
            }
        });
        
        // Copy cart quantity to mobile cart icon
        const $cartQuantity = $('.my_cart_quantity_parent .my_cart_quantity, .oe_cart .my_cart_quantity');
        if ($cartQuantity.length) {
            const quantity = parseInt($cartQuantity.text()) || 0;
            $('.my_cart_quantity').text(quantity).toggle(quantity > 0);
        }
    },

    /**
     * Initialize testimonial carousel for homepage
     */
    _initTestimonialCarousel: function() {
        const slider = document.querySelector('[data-testimonial-slider]');
        if (!slider) {
            return;
        }

        const track = slider.querySelector('.testimonial-track');
        const slides = Array.from(track.children);
        if (!slides.length) {
            return;
        }

        const prevBtn = slider.querySelector('.testimonial-nav.prev');
        const nextBtn = slider.querySelector('.testimonial-nav.next');
        const dotsWrap = slider.querySelector('.testimonial-dots');
        let index = 0;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let autoTimer = null;

        const goTo = (i, { immediate } = { immediate: false }) => {
            index = (i + slides.length) % slides.length;
            if (immediate) {
                track.style.transition = 'none';
            } else {
                track.style.transition = 'transform 600ms cubic-bezier(.22,.61,.36,1)';
            }
            track.style.transform = `translateX(${-index * 100}%)`;
            updateActive();
            updateDots();
        };

        const updateActive = () => {
            slides.forEach((slide, idx) => {
                slide.classList.toggle('is-active', idx === index);
            });
        };

        const buildDots = () => {
            if (!dotsWrap) {
                return;
            }
            dotsWrap.innerHTML = '';
            if (slides.length <= 1) {
                return;
            }
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
                dot.addEventListener('click', () => {
                    goTo(i);
                    resetAuto();
                });
                dotsWrap.appendChild(dot);
            });
        };

        const updateDots = () => {
            if (!dotsWrap) {
                return;
            }
            const dots = dotsWrap.querySelectorAll('button');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === index);
            });
        };

        const next = () => goTo(index + 1);
        const prev = () => goTo(index - 1);

        const startAuto = () => {
            if (slides.length <= 1) {
                return;
            }
            stopAuto();
            autoTimer = setInterval(next, 6000);
        };

        const stopAuto = () => {
            if (autoTimer) {
                clearInterval(autoTimer);
                autoTimer = null;
            }
        };

        const resetAuto = () => {
            stopAuto();
            startAuto();
        };

        const onPointerDown = (event) => {
            if (slides.length <= 1) {
                return;
            }
            const target = event.target;
            if (target.closest('.testimonial-nav') || target.closest('.testimonial-dots')) {
                return;
            }
            isDragging = true;
            startX = event.touches ? event.touches[0].clientX : event.clientX;
            currentX = startX;
            track.style.transition = 'none';
            stopAuto();
        };

        const onPointerMove = (event) => {
            if (!isDragging) {
                return;
            }
            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            currentX = clientX;
            const delta = currentX - startX;
            const deltaPercent = (delta / slider.clientWidth) * 100;
            track.style.transform = `translateX(${deltaPercent - index * 100}%)`;
        };

        const onPointerUp = () => {
            if (slides.length <= 1) {
                return;
            }
            if (!isDragging) {
                return;
            }
            isDragging = false;
            const threshold = slider.clientWidth * 0.18;
            const delta = currentX - startX;
            if (delta > threshold) {
                prev();
            } else if (delta < -threshold) {
                next();
            } else {
                goTo(index);
            }
            startAuto();
        };

        buildDots();
        goTo(0, { immediate: true });
        updateDots();
        startAuto();

        prevBtn && prevBtn.addEventListener('click', (event) => {
            event.preventDefault();
            prev();
            resetAuto();
        });

        nextBtn && nextBtn.addEventListener('click', (event) => {
            event.preventDefault();
            next();
            resetAuto();
        });

        slider.addEventListener('pointerdown', onPointerDown, { passive: true });
        slider.addEventListener('pointermove', onPointerMove, { passive: true });
        slider.addEventListener('pointerup', onPointerUp, { passive: true });
        slider.addEventListener('pointerleave', onPointerUp, { passive: true });
        slider.addEventListener('touchstart', onPointerDown, { passive: true });
        slider.addEventListener('touchmove', onPointerMove, { passive: true });
        slider.addEventListener('touchend', onPointerUp, { passive: true });
        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);
        window.addEventListener('resize', function() {
            goTo(index, { immediate: true });
        });
    },

    /**
     * Initialize simple IntersectionObserver to animate elements into view
     */
    _initScrollAnimations: function() {
        const services = document.querySelectorAll('.services-section .service-item');
        const categories = document.querySelectorAll('.categories-section .category-card');
        const courses = document.querySelectorAll('.courses-section .course-card');
        const elements = [...services, ...categories, ...courses];
        if (!elements.length) return;
        // If IntersectionObserver is not supported, show immediately
        if (!('IntersectionObserver' in window)) {
            elements.forEach(function(el) { el.classList.add('in-view'); });
            return;
        }
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.15
        });
        elements.forEach(function(el) { observer.observe(el); });
    },

    /**
     * Initialize hero carousel with smooth swipe and autoplay
     */
    _initHeroCarousel: function() {
        const root = document.querySelector('.elearn-carousel .carousel-viewport');
        if (!root) return;
        const track = root.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const prevBtn = root.querySelector('.carousel-nav.prev');
        const nextBtn = root.querySelector('.carousel-nav.next');
        const dotsWrap = root.querySelector('.carousel-dots');
        let index = 0;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let autoTimer = null;

        // Build dots
        if (dotsWrap) {
            dotsWrap.innerHTML = '';
            slides.forEach((_, i) => {
                const b = document.createElement('button');
                b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                b.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(b);
            });
        }

        function updateDots() {
            if (!dotsWrap) return;
            const dots = dotsWrap.querySelectorAll('button');
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
        }
        function applyTransform(offset = 0) {
            track.style.transition = offset === 0 ? 'transform 600ms cubic-bezier(.22,.61,.36,1)' : 'none';
            track.style.transform = `translateX(${offset - index * 100}%)`;
        }
        function goTo(i) {
            index = (i + slides.length) % slides.length;
            applyTransform(0);
            updateDots();
            updateActive();
        }
        function updateActive() {
            slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
        }
        function next() { goTo(index + 1); }
        function prev() { goTo(index - 1); }

        // Autoplay
        function startAuto() {
            stopAuto();
            autoTimer = setInterval(next, 5000);
        }
        function stopAuto() {
            if (autoTimer) clearInterval(autoTimer);
            autoTimer = null;
        }

        // Pointer/Touch handlers
        function onDown(e) {
            isDragging = true;
            track.style.transition = 'none';
            startX = (e.touches ? e.touches[0].clientX : e.clientX);
            currentX = startX;
            stopAuto();
        }
        function onMove(e) {
            if (!isDragging) return;
            const x = (e.touches ? e.touches[0].clientX : e.clientX);
            currentX = x;
            const dxPercent = ((currentX - startX) / root.clientWidth) * 100;
            track.style.transform = `translateX(${dxPercent - index * 100}%)`;
        }
        function onUp() {
            if (!isDragging) return;
            isDragging = false;
            const dx = currentX - startX;
            const threshold = root.clientWidth * 0.15;
            if (dx > threshold) prev();
            else if (dx < -threshold) next();
            else applyTransform(0);
            startAuto();
        }

        // Events
        root.addEventListener('pointerdown', onDown, { passive: true });
        root.addEventListener('pointermove', onMove, { passive: true });
        root.addEventListener('pointerup', onUp, { passive: true });
        root.addEventListener('pointerleave', onUp, { passive: true });
        root.addEventListener('touchstart', onDown, { passive: true });
        root.addEventListener('touchmove', onMove, { passive: true });
        root.addEventListener('touchend', onUp, { passive: true });
        prevBtn && prevBtn.addEventListener('click', (e) => { e.preventDefault(); prev(); });
        nextBtn && nextBtn.addEventListener('click', (e) => { e.preventDefault(); next(); });
        root.addEventListener('mouseenter', stopAuto);
        root.addEventListener('mouseleave', startAuto);

        // Init
        goTo(0);
        startAuto();
    },

    /**
     * Copy menu items from Odoo's default top_menu to our custom menu
     */
    _copyMenuItems: function() {
        const $originalMenu = $('#top_menu').not('#top_menu_custom');
        const $customMenu = $('#top_menu_custom');
        
        if ($originalMenu.length && $customMenu.length && $customMenu.children().length === 0) {
            // Clone all menu items
            $originalMenu.children('li').each(function() {
                const $item = $(this).clone(true, true); // Clone with data and events
                $customMenu.append($item);
            });
        }
    },

    /**
     * Initialize mobile search toggle functionality
     */
    _initMobileSearch: function() {
        const self = this;
        const $searchToggle = $('#mobileSearchToggle');
        const $searchBar = $('#mobileSearchBar');
        const $searchInput = $('#mobileSearchBar input[type="text"], #mobileSearchBar .foodmart-search-input-mobile');

        if ($searchToggle.length && $searchBar.length) {
            // Toggle search bar visibility
            $searchToggle.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const isVisible = $searchBar.is(':visible');

                if (isVisible) {
                    // Hide search bar
                    $searchBar.slideUp(200);
                    $searchToggle.removeClass('active');
                } else {
                    // Show search bar
                    $searchBar.slideDown(200);
                    $searchToggle.addClass('active');

                    // Focus on search input after animation
                    setTimeout(function() {
                        if ($searchInput.length) {
                            $searchInput.focus();
                        }
                    }, 250);
                }
            });

            // Close search bar when clicking outside
            $(document).on('click', function(e) {
                if (!$searchBar.is(e.target) &&
                    $searchBar.has(e.target).length === 0 &&
                    !$searchToggle.is(e.target) &&
                    $searchToggle.has(e.target).length === 0) {

                    if ($searchBar.is(':visible')) {
                        $searchBar.slideUp(200);
                        $searchToggle.removeClass('active');
                    }
                }
            });

            // Prevent search bar from closing when clicking inside it
            $searchBar.on('click', function(e) {
                e.stopPropagation();
            });
        }
    },
});

// Export for potential external usage (optional, but follows Odoo patterns)
export default publicWidget.registry.OdooElearningHeader;

