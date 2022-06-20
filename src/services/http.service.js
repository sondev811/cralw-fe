import axios from 'axios';

class HttpClient {
  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getHeader() {
    const headers = {
      'Content-Type': 'application/json',
    };
    return headers;
  }

  handleErrors(res) {
    if (!res) {
      return;
    }
    return {
      status: false,
      data: res.data.error
    };
  }

  async handleSuccess(res) {
    return {
      status: true,
      result: res
    };
  }

  async get(url) {
    try {
      url = 'http://localhost:5000' + url;
      const options = {
        headers: this.getHeader()
      };
      const response = await axios.get(url, options);
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleErrors(error.response);
    }
  }

  async post(url, body) {
    try {
      url = 'http://localhost:5000' + url;
      const options = {
        headers: this.getHeader()
      };
      const bodyParse = JSON.stringify(body);
      const response = await axios.post(url, bodyParse, options);
      return this.handleSuccess(response);
    } catch (error) {
      return this.handleErrors(error.response);
    }
  }
}

export default new HttpClient();
