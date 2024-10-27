class Presenter {

  constructor(view, interactor) {
    this.view = view;
    this.interactor = interactor;
    this.finalVal = 0;

    this.view.initCvInput.addEventListener('change', () => this.disableExchange());
    this.view.valInput.addEventListener('change', () => this.disableExchange());
    this.view.finalCvInput.addEventListener('change', () => this.handleCurrencyChange());
    this.view.saveButton.addEventListener('click', () => this.handleSave());
    this.loadData();
  }

  async loadData() {
    const conversions = await this.interactor.fetchConversionRates()
    const tasks = this.interactor.getFormData();
    this.view.displayConversions(conversions.BRL);
    this.view.displayTasks(tasks);
  }

  async handleCurrencyChange() {
    const formData = this.view.getFormData();
    const value = parseFloat(this.view.valInput.value);

    const { finalCv, initCv } = formData;
    if (finalCv != initCv) {
      const conversions = await this.interactor.fetchConversionRates()
      const finalCurrency = finalCv == 'BRL' ? conversions.USD : conversions.BRL;
      this.finalVal = value * finalCurrency[finalCv]
      this.view.finalValDiv.innerText = isNaN(this.finalVal) ? 0.00 : this.finalVal.toFixed(2)
      return
    }

    this.finalVal = value
    this.view.finalValDiv.innerText = isNaN(this.finalVal) ? 0.00 : this.finalVal.toFixed(2)

  }

  disableExchange() {
    const valuesInput = this.view.getFormData();
    let isValid = true;

    if (valuesInput.initCv.trim() === '' || valuesInput.initCv.trim() == 'Selecione') {
      isValid = false;
    }

    if (valuesInput.val <= 0 || valuesInput.val.trim() === '') {
      isValid = false;
    }

    this.view.finalCvInput.disabled = !isValid;
    this.view.finalValDiv.innerText = ''
  }

  async validateForm() {
    const valuesInput = this.view.getFormData();

    this.view.errorsMsg.forEach(msg => { if (msg.parentNode) { msg.remove() } });

    let isValid = true;

    if (valuesInput.desc.trim() === '') {
      isValid = false;
      this.view.createErrorInput(this.view.descInput, 'Descrição é obrigatória.');
    }

    if (valuesInput.qtd <= 0) {
      isValid = false;
      this.view.createErrorInput(this.view.qtdInput, 'Quantidade deve ser maior que 0.');
    }

    if (valuesInput.val <= 0 || valuesInput.val.trim() === '') {
      isValid = false;
      this.view.createErrorInput(this.view.valInput, 'Valor deve ser um número válido.');
    }

    if (valuesInput.initCv.trim() === '' || valuesInput.initCv.trim() == 'Selecione') {
      isValid = false;
      this.view.createErrorInput(this.view.initCvInput, 'Campo inicial é obrigatório.');
    }

    if (valuesInput.finalCv.trim() === '' || valuesInput.finalCv.trim() == 'Selecione') {
      isValid = false;
      this.view.createErrorInput(this.view.finalCvInput, 'Campo final é obrigatório.');
    }

    this.view.saveButton.disabled = !isValid;

  }

  initializeValidations() {
    const svBtText = this.view.saveButton.innerHTML;
    if (svBtText !== 'Salvar') {
      return;
    }

    this.validateForm()
    this.view.saveButton.disabled = false;
  }

  async handleSave() {
    this.initializeValidations();
    const formData = this.view.getFormData();
    const { desc, qtd, val, initCv, finalCv } = formData;

    if (desc && qtd > 0 && val && initCv && finalCv && this.finalVal) {
      formData.val = parseFloat(val).toFixed(2);
      formData.finalVal = this.finalVal.toFixed(2);
      this.interactor.saveToLocalStorage(formData);
      this.view.clearForm();
      this.loadData();
    } else {
      const svBtText = this.view.saveButton.innerHTML;
      if (svBtText !== 'Salvar') {
        return;
      }
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }

  editData(index) {
    const formData = this.interactor.getFormData()[index];
    this.view.setFormPlaceholder(formData);
    this.view.saveButton.innerHTML = 'Editar';

    this.view.saveButton.removeEventListener('click', this.handleSave);
    this.view.saveButton.addEventListener('click', () => this.handleEdit(index, formData));
  }

  handleEdit(index, oldData) {
    const formData = this.view.getFormData();
    const { desc, qtd, val, initCv, finalCv } = formData;

    if (desc && (desc !== oldData.desc) || qtd && (qtd !== oldData.qtd) || val && (val !== oldData.val) || initCv && (initCv !== oldData.initCv) || finalCv && (finalCv !== oldData.finalCv)
      || this.finalVal && (this.finalVal !== oldData.finalVal)

    ) {
      let updatedData = {
        desc: desc || oldData.desc,
        qtd: qtd || oldData.qtd,
        val: val || oldData.val,
        finalVal: this.finalVal || oldData.finalVal,
        initCv: initCv || oldData.initCv,
        finalCv: finalCv || oldData.finalCv
      };

      let allData = this.interactor.getFormData();
      allData[index] = updatedData;
      localStorage.setItem(this.interactor.storageKey, JSON.stringify(allData));
      this.view.clearForm();
      this.loadData();
      this.view.saveButton.innerHTML = 'Salvar';
      alert('Dados atualizados com sucesso!');
    } else {
      alert('Atualize os dados!');
    }
  }

  deleteData(index) {
    this.interactor.deleteData(index);
    this.loadData();
  }
}
