class Interactor {
  constructor() {
    this.storageKey = 'formData';
    this.cacheKey = 'conversionCache'; // Para armazenar a última vez que a API foi chamada
    this.cacheDurationKey = 'cacheData'; // Para armazenar os dados da API
    this.cacheDuration = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
  }

  saveToLocalStorage(data) {
    let formData = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    formData.push(data);
    localStorage.setItem(this.storageKey, JSON.stringify(formData));
  }

  getFormData() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  deleteData(index) {
    let formData = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    formData.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(formData));
  }

  async fetchConversionRates() {
    const now = Date.now();
    const lastFetchTime = parseInt(localStorage.getItem(this.cacheKey)) || 0;

    // Verifica se o cache está disponível e se não expirou
    if (lastFetchTime && (now - lastFetchTime < this.cacheDuration)) {
      if (this.isPWA()) {
        const cachedData = await this.getCachedData();
        if (cachedData) {
          return cachedData; // Retorna os dados do cache PWA
        }
      } else {
        const cachedData = localStorage.getItem(this.cacheDurationKey);
        if (cachedData) {
          return JSON.parse(cachedData); // Retorna os dados do localStorage
        }
      }
    }

    try {
      const [brlResponse, usdResponse] = await Promise.all([
        fetch('https://v6.exchangerate-api.com/v6/89e62a9a32114960109583c6/latest/BRL'),
        fetch('https://v6.exchangerate-api.com/v6/89e62a9a32114960109583c6/latest/USD')
      ]);

      if (!brlResponse.ok || !usdResponse.ok) {
        throw new Error('Erro ao buscar taxas de câmbio');
      }
      const brlData = await brlResponse.json();
      const usdData = await usdResponse.json();

      const data = {
        BRL: brlData.conversion_rates,
        USD: usdData.conversion_rates
      };

      // Armazena os dados no cache apropriado
      if (this.isPWA()) {
        await this.cacheData(data); // Armazena no cache PWA
      } else {
        localStorage.setItem(this.cacheDurationKey, JSON.stringify(data)); // Armazena no localStorage
      }
      localStorage.setItem(this.cacheKey, Date.now().toString());

      return data;
    } catch (error) {
      swal({
        title: "Erro!",
        text: error.message,
        icon: "error",
        button: "Fechar",
      });
      throw error; // Propaga o erro para o Presenter
    }
  }

  async cacheData(data) {
    const cache = await caches.open('exchange-rate-cache');
    const request = new Request('exchange-rates'); // Identificador para a resposta
    const response = new Response(JSON.stringify(data));

    await cache.put(request, response);
  }

  async getCachedData() {
    const cache = await caches.open('exchange-rate-cache');
    const request = new Request('exchange-rates');

    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      return cachedData; // Retorna os dados em cache
    }

    return null;
  }

  isPWA() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
}
