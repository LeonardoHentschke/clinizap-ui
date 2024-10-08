import axios from 'axios';
import { Instance } from '@/types/Instance';

const API_URL = process.env.VITE_API_URL;
const API_KEY = process.env.VITE_API_KEY;
const WEBHOOK_URL = process.env.VITE_WEBHOOK_URL;

export const InstanceService = {
  async fetchInstances() {
    return axios.get(`${API_URL}/instance/fetchInstances`, {
      headers: { 
        apikey: API_KEY 
      },
    });
  },

  async createInstance(instanceName: string, description: string, syncMessages: boolean) {
    const { data }: { data: Instance } = await axios.post(
      `${API_URL}/instance/create`,
      { instanceName, description, syncMessages },
      { headers: { apikey: API_KEY } },
    );
    return await this.setWebhook(data.name, data.Auth.token);
  },

  async connectInstance(name: string, token: string) {
    return axios.get(`${API_URL}/instance/connect/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async logoutInstance(name: string, token: string) {
    try {
      return axios.delete(`${API_URL}/instance/logout/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  async deleteInstance(name: string, token: string) {
    return axios.delete(`${API_URL}/instance/delete/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        force: true,
      },
    });
  },

  async sendMessage(
    name: string = '',
    token: string = '',
    phoneNumber: string = '',
    message: string = '',
  ) {
    return axios.post(
      `${API_URL}/message/sendText/${name}`,
      {
        number: phoneNumber,
        options: {
          delay: 3000,
        },
        textMessage: {
          text: message,
        },
      },
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      },
    );
  },

  async findWebhook(name: string = '', token: string = '') {
    return axios.get(`${API_URL}/webhook/find/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async setWebhook(name: string = '', token: string = '') {
    return axios.put(
      `${API_URL}/webhook/set/${name}`,
      {
        enabled: true,
        url: `${WEBHOOK_URL}/api/whatsapp-webhook`,
        events: {
          messagesSet: true,
          messagesUpsert: true,
          messagesUpdated: true,
          sendMessage: true,
          connectionUpdated: true,
        },
      },
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      },
    );
  },

  async reloadInstance(name: string, token: string) {
    return axios.patch(`${API_URL}/instance/reload/${name}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
