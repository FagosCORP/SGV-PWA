class Presenter {
  constructor(view, interactor) {
    this.view = view;
    this.interactor = interactor;
    this.finalVal = 0;

    this.initEventListeners();
    this.loadData();
  }

  initEventListeners() {
    this.view.initCvInput.addEventListener('change', this.disableExchange.bind(this));
    this.view.valInput.addEventListener('change', this.disableExchange.bind(this));
    this.view.saveButton.addEventListener('click', this.handleSave.bind(this));
    this.view.finalCvInput.addEventListener('change', this.handleCurrencyChange.bind(this));
  }

  async loadData() {
    const conversions = await this.interactor.fetchConversionRates();
    const tasks = this.interactor.getFormData();
    this.view.displayConversions(conversions.BRL);
    this.view.displayTasks(tasks);
  }

  async handleCurrencyChange() {
    const { finalCv, initCv, val, qtd } = this.view.getFormData();
    const conversions = await this.interactor.fetchConversionRates();
    this.finalVal = this.calculateFinalValue(val, qtd, initCv, finalCv, conversions);

    this.view.finalValDiv.value = isNaN(this.finalVal) ? '0.00' : this.finalVal.toFixed(2);
    this.updateSaveButtonState();
  }

  calculateFinalValue(value, qtd, initCv, finalCv, conversions) {
    const baseValue = parseFloat(value) * (parseFloat(qtd) || 0);
    if (finalCv === initCv) return baseValue;

    const conversionRate = conversions[initCv] ? conversions[initCv][finalCv] : 1;
    return baseValue * (conversionRate || 1);
  }

  handleSave() {
    if (this.view.saveButton.innerHTML == 'Editar') return;
    if (!this.validateForm()) return;

    const formData = this.view.getFormData();
    formData.val = (parseFloat(formData.val) * formData.qtd).toFixed(2);
    formData.finalVal = this.finalVal.toFixed(2);

    this.interactor.saveToLocalStorage(formData);
    this.view.clearForm();
    this.loadData();
  }

  updateSaveButtonState() {
    const { desc, qtd, val, initCv, finalCv } = this.view.getFormData();
    this.view.saveButton.disabled = !this.isFormValid(desc, qtd, val, initCv, finalCv);
  }

  disableExchange() {
    const valuesInput = this.view.getFormData();
    const isValid = this.isExchangeValid(valuesInput);

    this.view.finalCvInput.disabled = !isValid;
    if (!isValid) {
      this.view.finalCvInput.value = '';
      this.view.finalValDiv.value = '';
      return;
    }
    this.handleCurrencyChange();
  }

  isExchangeValid(valuesInput) {
    return valuesInput.initCv.trim() !== '' &&
      valuesInput.initCv.trim() !== 'Selecione' &&
      valuesInput.val > 0;
  }

  validateForm() {
    const valuesInput = this.view.getFormData();
    this.clearErrors();

    const validations = [
      { condition: !valuesInput.desc.trim(), error: 'Descrição é obrigatória.', field: this.view.descInput },
      { condition: valuesInput.qtd <= 0, error: 'Quantidade deve ser maior que 0.', field: this.view.qtdInput },
      { condition: valuesInput.val <= 0 || valuesInput.val.trim() === '', error: 'Valor deve ser um número válido.', field: this.view.valInput },
      { condition: !valuesInput.initCv.trim() || valuesInput.initCv === 'Selecione', error: 'Campo inicial é obrigatório.', field: this.view.initCvInput },
      { condition: !valuesInput.finalCv.trim() || valuesInput.finalCv === 'Selecione', error: 'Campo final é obrigatório.', field: this.view.finalCvInput }
    ];

    let isValid = true;
    validations.forEach(({ condition, error, field }) => {
      if (condition) {
        isValid = false;
        this.view.createErrorInput(field, error);
      }
    });

    return isValid;
  }

  clearErrors() {
    this.view.errorsMsg.forEach(msg => msg.remove());
  }

  toggleSaveEditMode(isEditMode, index = null) {
    if (isEditMode) {
      this.view.saveButton.removeEventListener('click', this.handleSave.bind(this));
      this.view.saveButton.innerHTML = 'Editar';
      this.view.saveButton.onclick = () => this.handleEdit(index);
    } else {
      this.view.saveButton.innerHTML = 'Salvar';
    }
  }

  handleSave() {
    if (this.view.saveButton.innerHTML == 'Editar') return;
    if (!this.validateForm()) return;

    const formData = this.view.getFormData();
    formData.val = (parseFloat(formData.val) * formData.qtd).toFixed(2);
    formData.finalVal = this.finalVal.toFixed(2);

    this.interactor.saveToLocalStorage(formData);
    this.view.clearForm();
    this.loadData();
  }

  isFormValid(desc, qtd, val, initCv, finalCv) {
    return desc && qtd > 0 && val && initCv && finalCv && this.finalVal > 0;
  }

  async editData(index) {
    const formData = this.interactor.getFormData()[index];
    this.view.setFormData(formData);
    this.handleCurrencyChange();
    this.toggleSaveEditMode(true, index);
  }

  handleEdit(index) {
    if (!this.validateForm()) {
      return;
    }

    const formData = this.view.getFormData();

    const updatedData = this.getUpdatedData(formData);

    if (this.hasChanges(updatedData, this.interactor.getFormData()[index])) {
      alert('Dados atualizados com sucesso!');
      this.view.clearForm();
      this.view.saveButton.innerHTML = 'Salvar';
      this.interactor.saveToLocalStorage(updatedData, index);
      this.loadData();
    } else {
      alert('Nenhuma alteração detectada.');
    }
    this.toggleSaveEditMode(false);
  }

  getUpdatedData(formData) {
    return {
      desc: formData.desc,
      qtd: formData.qtd,
      val: (parseFloat(formData.val) * formData.qtd).toFixed(2),
      finalVal: this.finalVal.toFixed(2),
      initCv: formData.initCv,
      finalCv: formData.finalCv
    };
  }

  hasChanges(updatedData, oldData) {
    return JSON.stringify(updatedData) !== JSON.stringify(oldData);
  }

  deleteData(index) {
    this.interactor.deleteData(index);
    this.loadData();
  }
}

