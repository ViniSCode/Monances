//Local Storage
const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transaction")) || [];
  },

  set(transactions){
    localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions))
  }
}

const Transaction = {
  all:Storage.get(),

  add(transaction){
    Transaction.all.push(transaction)
    App.reload()
  },
  
  remove(index){
    Transaction.all.reverse().splice(index, 1)
    App.reload()
  },

  incomes(){
    // total incomes
    let income = 0;

    Transaction.all.forEach(transaction => { 
      if(transaction.amount > 0){
        income += transaction.amount
      }
    })
    return income 
  },
  expenses(){
    // total expenses
    let expense = 0;
    
    Transaction.all.forEach(transaction => {
      if(transaction.amount < 0){
        expense += transaction.amount
      }
    })
    return expense
  },
  total(){
    //total
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
      const CSSclass = transaction.amount > 0 ? "income" : "expense"

      const amount = Utils.formatCurrency(transaction.amount)

      const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
          <img onclick="Transaction.remove(${index})" src="./assets/x-circle.svg" class="remove-transaction" alt="Remover transação">
      </td>
      `
      return html
  },


  //show balance cards (incomes, expenses and total)
  updateBalance(){
    document
    .getElementById('incomeDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.incomes())

    document
    .getElementById('expenseDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.expenses())

    document
    .getElementById('totalDisplay')
    .innerHTML = Utils.formatCurrency(Transaction.total())

  },

  clearTransactions(){
    DOM.transactionsContainer.innerHTML = ""
  }
}

const Utils = {
  formatAmount(value){
    value = Number(value) * 100

    return value;
  },

  formatDate(date){
    const splitedDate = date.split("-")
    return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
  },

  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : "";

    //expressão regular /\D/ significa:
    //ache tudo que não for Número 
    value = String(value).replace(/\D/g, "")

    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style:"currency",
      currency: "BRL"
    })
    
    return signal + value;
  },
}


const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),


  getValues(){
    //get input (modal) values
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    }
  },

  validateField(){
    const {description, amount, date} = Form.getValues()

    if(description.trim() === "" || 
      amount.trim === "" || 
      date.trim() === ""){
        throw new Error("Por favor, preencha todos os campos")
      }
  },

  formatValues(){
    let {description, amount, date, value} = Form.getValues()

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount, 
      date
    }
  },

  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
    Form.value = ""
  },

  submit(event){
    
    event.preventDefault()

    try{
      //verify fields before submit
      Form.validateField()
      const transaction = Form.formatValues()
      //salvar
      Transaction.add(transaction)
      //clear modal fields
      Form.clearFields()
      //close modal
      Modal.close()
    }
    catch(error){
      alert(error.message)
    }

  }
}

// ChartJS - doughnut chart - chart config
var ctx = document.getElementById('myChart');
var myDonutChart;

const AddChart = {
  Destroy(){
    if(myDonutChart){
      myDonutChart.destroy();
    }
    this.update();
  },

  getData(){
    let data;
    if(Transaction.incomes().toString() !== '0' ||  Transaction.expenses().toString() !== '0'){
      data = {
        datasets: [{
            data: [Transaction.incomes() / 100, Transaction.expenses() / 100],
            backgroundColor: ['#28D39A', '#ff7782', '#7380EC'],
            usePointStyle: true,
        }],
        labels: ['Incomes', 'Expenses']
      };  
    }

    else{
      data = {
        datasets: [{
            data: [100],
            backgroundColor: ['#bbb'],
            usePointStyle: true,
        }],
        labels: ['No Transactions']
      };  
    }
    return data;
  },

  getOptions(){
    let options;
    if(Transaction.incomes().toString() === '0' &&  Transaction.expenses().toString() === '0'){
      var style = getComputedStyle(document.body)
      const darkThemeTextColor = style.getPropertyValue('--color-info-dark')

      options = {
        tooltips: {enabled: false},
        hover: {mode: null},
        legend:{
          position: 'bottom',
          usePointStyle: true,
          labels:{
            fontSize: 16,
            fontFamily: 'Poppins, sans-serif',
            fontStyle: '500',
            fontColor: darkThemeTextColor,
            usePointStyle: true,
          },
        }, 
        responsive: true,
        maintainAspectRatio: false,
      };
    }

    else{
      var style = getComputedStyle(document.body)
      const darkThemeTextColor = style.getPropertyValue('--color-info-dark')

      options = {
        legend:{
          position: 'bottom',
          usePointStyle: true,
          labels:{
            fontSize: 16,
            fontFamily: 'Poppins, sans-serif',
            fontStyle: '500',
            fontColor: darkThemeTextColor,
            usePointStyle: true,
          },
          onHover: function (event, legendItem) {
            // There is only a legendItem when your mouse is positioned over one
            if (legendItem) {
                event.target.style.cursor = 'pointer';
            }
          }
        }, 
        responsive: true,
        maintainAspectRatio: false,
      };
  
    }
    
    return options
  },

  update(){
    let options = this.getOptions();
    let data = this.getData();

    myDonutChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options
    });
  }      
}

const App = {
  init() {
    Transaction.all.reverse().forEach(DOM.addTransaction)
    DOM.updateBalance()
    Storage.set(Transaction.all.reverse())
  },
  reload(){
    myDonutChart.destroy();
    DOM.clearTransactions()
    AddChart.update()
    App.init()
  }
}

App.init()
AddChart.update();





