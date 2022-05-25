(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 16
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }
  
  $(".back-to-top").click(function() {
    window.scroll({top: 0, behavior: "smooth"})  
  });

  $(".btn-get-started").click(function() {
    $('html, body').animate({
        scrollTop: $(".about").offset().top
    }, 100);
  });

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  // POST REQUEST
  const emoji_yay = $(".emoji--yay")
  const emoji_sad = $(".emoji--sad")
  const emoji_norm = $(".emoji--norm")

  $("#check-btn").on("click", function(e) {
    e.preventDefault()
    const tweets = $("#twemoji-textarea").val();
    if (tweets !== '') {
      $.ajax({
        method: "POST",
        url: "/process",
        data: {tweets},
        success: function(res) {
          const result = parseInt(res['bullying_text'])
          if (result === 1) {
            $('#status').val('CyberBullying')
            emoji_sad.css('display', 'flex')
            emoji_yay.css('display', 'None')
            emoji_norm.css('display', 'None')
          }            
          else if (result === 0) {
            $('#status').val('Not CyberBullying')
            emoji_sad.css('display', 'None')
            emoji_yay.css('display', 'flex')
            emoji_norm.css('display', 'None')
          } else {
            $('#status').val('Unknown');
            emoji_sad.css('display', 'None');
            emoji_yay.css('display', 'None');
            emoji_norm.css('display', 'flex');
          }            
        },
        error: function(res) {
          console.log("error", res);
        }
      });
    } else {
      alert("Text Field is empty!")
    }
    
  });

  $('#reset-btn').on('click', function(e) {
    //TextArea Reset
    const text_area = $("#twemoji-textarea").val()
    if (text_area !== '') {
      $("#twemoji-textarea").val('');
      $('#status').val('Status...');
      emoji_sad.css('display', 'None');
      emoji_yay.css('display', 'None');
      emoji_norm.css('display', 'flex');
    } else {
      alert('Oopsy! Nothing to reset!');
    }    
  })


})()