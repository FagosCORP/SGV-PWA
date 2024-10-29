class View {
  constructor() {
    this.document = document;
    this.inputs = document.querySelectorAll('input');
    this.descInput = document.getElementById('desc');
    this.qtdInput = document.getElementById('qtd');
    this.valInput = document.getElementById('initVal');
    this.initCvInput = document.getElementById('initCv');
    this.finalCvInput = document.getElementById('finalCv');
    this.saveButton = document.getElementById('saveBt');
    this.finalValDiv = document.getElementById('finalVal');
    this.resultDiv = document.getElementById('result');
  }

  get errorsMsg() {
    return this.document.querySelectorAll('.error-message');
  }

  createErrorInput(input, msg) {
    const error = document.createElement('div');
    error.classList.add('error-message');
    error.textContent = msg;
    input.parentNode.appendChild(error);
  }

  displayTasks(tasks) {
    this.resultDiv.innerHTML = '';
    tasks.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('card', 'my-3', 'shadow-sm');
      itemDiv.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${item.desc}</h5>
            <p class="card-text">
              <strong>Quantidade:</strong> ${item.qtd} <br>
            <strong>Inicial: (${item.initCv}) </strong>
            ${item.val}
            <br>
            <strong>Final: (${item.finalCv}) </strong>
            ${item.finalVal}

            <br>
            <div class="d-flex justify-content-between">
              <button class="btn btn-warning btn-sm" onclick="presenter.editData(${index})">
                <i class="bi bi-pencil-fill"></i> Editar
              </button>
              <button class="btn btn-danger btn-sm" onclick="presenter.deleteData(${index})">
                <i class="bi bi-trash-fill"></i> Deletar
              </button>
            </div>
          </div>
      `;
      this.resultDiv.appendChild(itemDiv);
    });
  }

  async displayConversions(conversions) {
    this.initCvInput.innerHTML = '';
    this.finalCvInput.innerHTML = '';

    const conversionsData = await conversions;
    this.populateInitialCurrencyOptions();
    this.populateFinalCurrencyOptions(conversionsData);
  }

  createDefaultOption() {
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione';
    return defaultOption;
  }



  populateInitialCurrencyOptions() {
    const currencies = ['BRL', 'USD'];

    this.initCvInput.appendChild(this.createDefaultOption());

    currencies.forEach(currency => {
      const option = document.createElement('option');
      option.value = currency;
      option.textContent = currency;
      this.initCvInput.appendChild(option);
    });
  }

  populateFinalCurrencyOptions(conversionsData) {
    this.finalCvInput.appendChild(this.createDefaultOption());

    const conversionKeys = Object.keys(conversionsData);

    conversionKeys.forEach(key => {
      const option = document.createElement('option');
      option.value = conversionsData[key];
      option.textContent = key;
      this.finalCvInput.appendChild(option);
    });
  }


  clearForm() {
    this.descInput.value = '';
    this.qtdInput.value = '';
    this.valInput.value = '';
    this.initCvInput.value = '';
    this.finalCvInput.value = '';
    this.finalValDiv.value = '';
  }

  getFormData() {
    return {
      desc: this.descInput.value || '',
      qtd: this.qtdInput.value || 0,
      val: this.valInput.value || 0,
      initCv: this.initCvInput.options[this.initCvInput.selectedIndex].text || '',
      finalCv: this.finalCvInput.options[this.finalCvInput.selectedIndex].text || '',
    };
  }

  setFormData(data) {
    console.log(this.finalCvInput);
    this.descInput.value = data.desc;
    this.qtdInput.value = data.qtd;
    this.valInput.value = data.val;
    this.initCvInput.value = data.initCv;
    this.finalCvInput.value = data.finalCv;
  }

  setFormPlaceholder(data) {
    this.descInput.placeholder = data.desc;
    this.qtdInput.placeholder = data.qtd;
    this.valInput.placeholder = data.val;
    this.initCvInput.placeholder = data.initCv;
    this.finalCvInput.placeholder = data.finalCv;
  }
}
