/* ==========================================================
   Yash Dhiman | Portfolio scripts

   Contents
   1.  Nav menu
   2.  Home circular text
   3.  Typed text
   4.  Header blur on scroll
   5.  Scroll-up button
   6.  Active link (scroll-spy)
   7.  Work slider (Swiper)
   8.  Services accordion
   9.  Skills accordion
   10. Contact form (EmailJS)
   11. Footer year
   12. Scroll reveal
   ========================================================== */

/*=============== 1. NAV MENU ===============*/
const navMenu = document.getElementById('nav-menu')
const navToggle = document.getElementById('nav-toggle')
const navClose = document.getElementById('nav-close')

const openMenu = () => {
   navMenu.classList.add('show-menu')
   navToggle.setAttribute('aria-expanded', 'true')
}

const closeMenu = () => {
   navMenu.classList.remove('show-menu')
   navToggle.setAttribute('aria-expanded', 'false')
}

if (navToggle) navToggle.addEventListener('click', openMenu)
if (navClose) navClose.addEventListener('click', closeMenu)

// Close the menu when a link is clicked, or with the Escape key
document.querySelectorAll('.nav__link, .nav__contact').forEach(link => {
   link.addEventListener('click', closeMenu)
})

document.addEventListener('keydown', event => {
   if (event.key === 'Escape') closeMenu()
})

/*=============== 2. HOME CIRCULAR TEXT ===============*/
const homeText = document.getElementById('home-text')

if (homeText) {
   const letters = homeText.textContent.trim().split('')
   const angleStep = 360 / letters.length

   homeText.textContent = ''

   letters.forEach((char, i) => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.transform = `rotate(${i * angleStep}deg)`
      homeText.appendChild(span)
   })
}

/*=============== 3. TYPED TEXT ===============*/
// Guarded: a failed CDN can't break the rest of the site
if (document.getElementById('home-typed') && typeof Typed !== 'undefined') {
   new Typed('#home-typed', {
      strings: ['Aspiring Data Analyst', 'Web Developer', 'Problem Solver'],
      typeSpeed: 55,
      backSpeed: 28,
      backDelay: 2000,
      loop: true,
   })
}

/*=============== 4. HEADER BLUR ON SCROLL ===============*/
const header = document.getElementById('header')

const scrollHeader = () => {
   header.classList.toggle('scroll-header', window.scrollY >= 50)
}

window.addEventListener('scroll', scrollHeader)
scrollHeader()

/*=============== 5. SCROLL-UP BUTTON ===============*/
const scrollUp = document.getElementById('scroll-up')

const showScrollUp = () => {
   scrollUp.classList.toggle('show-scrollup', window.scrollY >= 400)
}

window.addEventListener('scroll', showScrollUp)
showScrollUp()

/*=============== 6. ACTIVE LINK (SCROLL-SPY) ===============*/
const navLinks = document.querySelectorAll('.nav__link, .nav__contact')

const spiedSections = [...document.querySelectorAll('section[id]')].filter(section =>
   document.querySelector(`.nav__link[href="#${section.id}"], .nav__contact[href="#${section.id}"]`)
)

const spyObserver = new IntersectionObserver(entries => {
   entries.forEach(entry => {
      if (!entry.isIntersecting) return

      navLinks.forEach(link => {
         link.classList.toggle('active-link', link.getAttribute('href') === `#${entry.target.id}`)
      })
   })
}, { rootMargin: '-40% 0px -55% 0px' })

spiedSections.forEach(section => spyObserver.observe(section))

/*=============== 7. WORK SLIDER (SWIPER) ===============*/
if (document.querySelector('.work__swiper') && typeof Swiper !== 'undefined') {
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

   new Swiper('.work__swiper', {
      loop: true,
      spaceBetween: 24,
      slidesPerView: 1,
      pagination: {
         el: '.swiper-pagination',
         clickable: true,
      },
      autoplay: prefersReducedMotion ? false : {
         delay: 3000,
         disableOnInteraction: false,
         pauseOnMouseEnter: true,
      },
      breakpoints: {
         768: { slidesPerView: 2 },
         1150: { slidesPerView: 3 },
      },
   })
}

/*=============== 8. SERVICES ACCORDION ===============*/
const servicesCards = document.querySelectorAll('.services__card')

servicesCards.forEach(card => {
   const button = card.querySelector('.services__button')
   if (!button) return

   button.addEventListener('click', () => {
      const isOpen = card.classList.contains('services-open')

      // Only one card open at a time
      servicesCards.forEach(other => {
         other.classList.remove('services-open')
         other.querySelector('.services__button')?.setAttribute('aria-expanded', 'false')
      })

      if (!isOpen) {
         card.classList.add('services-open')
         button.setAttribute('aria-expanded', 'true')
      }
   })
})

/*=============== 9. SKILLS ACCORDION ===============*/
// The button, arrow and collapsible area are built here,
// so the skills HTML stays simple (profession + list per card)
const skillsCards = document.querySelectorAll('.skills__card')

const openSkillsCard = (card, button) => {
   card.classList.add('skills-open')
   button.setAttribute('aria-expanded', 'true')
}

skillsCards.forEach(card => {
   const profession = card.querySelector('.skills__profession')
   const list = card.querySelector('.skills__list')
   if (!profession || !list) return

   // Wrap the heading in a button and add the arrow
   const button = document.createElement('button')
   button.type = 'button'
   button.className = 'skills__button'
   button.setAttribute('aria-expanded', 'false')

   const arrow = document.createElement('div')
   arrow.className = 'skills__arrow'
   arrow.innerHTML = '<i class="ri-arrow-down-s-line"></i>'

   card.insertBefore(button, profession)
   button.append(profession, arrow)

   // Wrap the list in the collapsible area
   const data = document.createElement('div')
   data.className = 'skills__data'
   card.insertBefore(data, list)
   data.appendChild(list)

   // Only one card open at a time
   button.addEventListener('click', () => {
      const isOpen = card.classList.contains('skills-open')

      skillsCards.forEach(other => {
         other.classList.remove('skills-open')
         other.querySelector('.skills__button')?.setAttribute('aria-expanded', 'false')
      })

      if (!isOpen) openSkillsCard(card, button)
   })
})

// First card starts open
const firstSkillsCard = skillsCards[0]
const firstSkillsButton = firstSkillsCard?.querySelector('.skills__button')

if (firstSkillsButton) openSkillsCard(firstSkillsCard, firstSkillsButton)

/*=============== 10. CONTACT FORM (EMAILJS) ===============*/
const contactForm = document.getElementById('contact-form')
const contactMessage = document.getElementById('contact-message')

if (contactForm && typeof emailjs !== 'undefined') {
   contactForm.addEventListener('submit', async event => {
      event.preventDefault()

      const submitButton = contactForm.querySelector('.contact__button')
      submitButton.disabled = true

      try {
         // service ID, template ID, form selector, public key
         await emailjs.sendForm('service_av51tfq', 'template_isy3tcw', '#contact-form', '-RLUEmGp3ckRb24sU')
         contactMessage.textContent = 'Message sent successfully ✅'
         contactForm.reset()
      } catch (error) {
         contactMessage.textContent = 'Message not sent (service error) ❌'
      } finally {
         submitButton.disabled = false
         setTimeout(() => (contactMessage.textContent = ''), 5000)
      }
   })
}

/*=============== 11. FOOTER YEAR ===============*/
const footerYear = document.getElementById('footer-year')

if (footerYear) footerYear.textContent = new Date().getFullYear()

/*=============== 12. SCROLL REVEAL ===============*/
const revealElements = document.querySelectorAll('.reveal')

if ('IntersectionObserver' in window) {
   const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
         if (!entry.isIntersecting) return

         entry.target.classList.add('reveal-visible')
         revealObserver.unobserve(entry.target)
      })
   }, { rootMargin: '0px 0px -10% 0px' })

   revealElements.forEach(element => revealObserver.observe(element))
} else {
   // Very old browsers: show everything immediately
   revealElements.forEach(element => element.classList.add('reveal-visible'))
}
