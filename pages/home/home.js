const Menu = {
  open(){
    document.querySelector('.mobile-menu').classList.add('active');
  },
  close(){
    document.querySelector('.mobile-menu').classList.remove('active');
  }
}