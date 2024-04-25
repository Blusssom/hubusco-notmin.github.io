const burger = document.querySelector('.burger');
const mobileNav = document.querySelector('.header__mob-wrapper');
const investItems = document.querySelectorAll('.analytics__invest-item');
const investLine = document.querySelector('.analytics__invest-line');

burger.addEventListener('click', function(e) {
    document.body.classList.toggle('mobile-nav');
});

mobileNav.addEventListener('click', function(e) {
    const target = e.target;
    if (target.classList.contains('nav__item-link') || target.classList.contains('nav__item') || target.classList.contains('header__btn')) {
        document.body.classList.remove('mobile-nav');
    }
})

investItems.forEach(item => {
    item.addEventListener('click', function(e) {
        investItems.forEach(item => {
            item.classList.remove('active');
        });

        const target = e.currentTarget;
        target.classList.add('active');
        const crawlerPos = target.getAttribute('data-invest-item');
        const investItem = target.getAttribute('data-invest-item-count');
        investLine.style.justifyContent = crawlerPos;
        document.querySelector('.analytics__invest-line-count').innerHTML = investItem;
    })
});

// Phone Mask
mask('[data-tel-input]');

const phoneInput = document.querySelectorAll('[data-tel-input]');
phoneInput.forEach(function(input) {
    input.addEventListener('input', removePhonePlus)
    input.addEventListener('blur', removePhonePlus)

    function removePhonePlus() {
        if (input.value == '+') {
            input.value = '';
        }
    }
})