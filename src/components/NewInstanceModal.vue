<script setup lang="ts">
import { ref } from 'vue';
import { InstanceService } from '@/api/InstanceApi';
import { slugify } from '@/utils/slugify';

const name = ref('');
const description = ref('');
const sync = ref(false);

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'created'): void;
}>();

const createInstance = async (): Promise<void> => {
  try {
    const formattedName = slugify(name.value);
    const { status } = await InstanceService.createInstance(
      formattedName,
      description.value,
      true
    );
    if (status === 201) {
      emits('created');
    }
  } catch (error: any) {
    alert(JSON.stringify(error.response.data, null, 2));
  } finally {
    emits('close');
  }
};
</script>

<template>
  <eui-modal :title="'Adicionar Instância'" @close="$emit('close')">
    <div>
      <eui-input-text v-model="name" placeholder="Digite o nome" label="Nome" />

      <eui-input-text
        v-model="description"
        placeholder="Digite a descrição"
        label="Descrição"
      />

      <eui-input-checkbox v-model="sync" label="Sincronizar mensagens" />
    </div>

    <div class="is-flex is-justify-content-flex-end">
      <eui-button color="primary" @click="createInstance">Salvar</eui-button>
    </div>
  </eui-modal>
</template>
