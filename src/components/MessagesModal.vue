<script setup lang="ts" name="NewInstaceModal">
import { ref } from 'vue';
import { InstanceService } from '@/api/InstanceApi';
import { Instance } from '@/types/Instance';

const number = ref('');
const message = ref('');
const isLoading = ref(false);

const prop = defineProps<{
  instance: Instance;
}>();

const emits = defineEmits<{
  (e: 'close'): void;
}>();

const sendMessage = async (): Promise<void> => {
  isLoading.value = true;
  try {
    const phoneNumber = number.value.replace('+', '');
    const { data } = await InstanceService.sendMessage(
      prop.instance.name,
      prop.instance.Auth.token,
      phoneNumber,
      message.value,
    );
    if (data.id) {
      alert('Mensagem enviada com sucesso');
    }
  } catch (error: any) {
    alert(JSON.stringify(error.response.data, null, 2));
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <eui-modal title="Enviar mensagem" @close="emits('close')">
    <div>
      <eui-input-phone v-model="number" label="Telefone" />
      <eui-input-textarea v-model="message" label="Mensagem" />
    </div>

    <div class="is-flex is-justify-content-flex-end">
      <eui-button color="primary" @click="sendMessage" :isLoading="isLoading"
        >Enviar</eui-button
      >
    </div>
  </eui-modal>
</template>
