
// Dark and light theme
const themeToggler = document.querySelector('.theme-toggler')
const toggleDark = document.querySelector('#toggle-dark');
const toggleLight = document.querySelector('#toggle-light');

toggleLight.addEventListener('click', () => {
  localStorage.setItem("theme", JSON.stringify('light'))
  document.body.classList.remove('dark-theme-variables');
  toggleLight.classList.add('active');
  toggleDark.classList.remove('active');
})

toggleDark.addEventListener('click', () => {
  localStorage.setItem("theme", JSON.stringify('dark'))
  document.body.classList.add('dark-theme-variables');
  toggleDark.classList.add('active');
  toggleLight.classList.remove('active');
})


if(JSON.parse(localStorage.getItem("theme") == null)){
  localStorage.setItem("theme", JSON.stringify('light'))
  toggleLight.classList.add('active')
  toggleDark.classList.remove('active');
}

if(JSON.parse(localStorage.getItem("theme")) == 'dark'){
  document.body.classList.add('dark-theme-variables');
  toggleDark.classList.add('active');
  toggleLight.classList.remove('active');
}
if(JSON.parse(localStorage.getItem("theme")) == 'light'){
  document.body.classList.remove('dark-theme-variables');
  toggleLight.classList.add('active')
  toggleDark.classList.remove('active');
}