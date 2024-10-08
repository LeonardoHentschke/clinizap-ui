<script setup lang="ts">
import { computed, ref } from 'vue';
import { InstanceService } from '@/api/InstanceApi';
import { Instance } from '@/types/Instance';
import MobileImage from '@/assets/img/mobile.png';
import MessagesModal from '@/components/MessagesModal.vue';

const props = defineProps<{
  instance: Instance;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'deleted', instanceName: string): void;
}>();

const qrCode = ref('');
const isConnectLoading = ref(false);
const isDeleteLoading = ref(false);
const showModal = ref(false);

const connectInstance = async () => {
  isConnectLoading.value = true;
  try {
    const { data } = await InstanceService.connectInstance(
      props.instance.name,
      props.instance.Auth.token,
    );
    qrCode.value = data.base64;
  } catch (error: any) {
    alert(JSON.stringify(error.response.data, null, 2));
  } finally {
    isConnectLoading.value = false;
  }
};

const deleteInstance = async () => {
  isDeleteLoading.value = true;
  try {
    const { status } = await InstanceService.deleteInstance(
      props.instance?.name ?? '',
      props.instance?.Auth.token ?? '',
    );
    if (status === 200) {
      emit('deleted', props.instance?.name);
    }
  } catch (error: any) {
    alert(JSON.stringify(error.response.data, null, 2));
  } finally {
    isDeleteLoading.value = false;
    emit('close');
  }
};

const isOnline = computed(() => {
  if (!props.instance) {
    return false;
  }
  return props.instance.connectionStatus === 'ONLINE';
});

const formattedDate = computed(() => {
  const format = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString()
      : new Date().toLocaleDateString();

  return {
    createdAt: format(props.instance?.createdAt),
    updatedAt: format(props.instance?.updatedAt),
  };
});

const copyToClipboard = (value: string) => {
  navigator.clipboard
    .writeText(value)
    .then(() => {
      alert('Valor copiado para a área de transferência!');
    })
    .catch((err) => {
      alert('Falha ao copiar: ' + err);
    });
};
</script>

<template>
  <eui-drawer
    v-if="instance"
    title="Detalhes da instância"
    :isRight="true"
    :isFixed="true"
    :isCloseable="true"
    :isShadowed="true"
    :hasOverlay="true"
    size="large"
    @close="emit('close')"
  >
    <div class="hero-body">
      <div class="content">
        <div class="columns">
          <div class="column">
            <eui-label>ID</eui-label>
            <eui-input-text disabled="true" :modelValue="props.instance?.id" />
          </div>
          <div class="column">
            <eui-label>Nome</eui-label>
            <eui-input-text
              disabled="true"
              :modelValue="props.instance?.name"
            />
          </div>
        </div>

        <div>
          <eui-label>Descrição</eui-label>
          <eui-input-text
            disabled="true"
            :modelValue="props.instance?.description"
          />
        </div>

        <div>
          <eui-label>Status</eui-label>
          <eui-input-text
            disabled="true"
            :modelValue="props.instance?.connectionStatus"
          />
        </div>

        <div class="columns">
          <div class="column">
            <eui-label>Criado em</eui-label>
            <eui-input-text
              disabled="true"
              :modelValue="formattedDate.createdAt"
            />
          </div>

          <div class="column">
            <eui-label>Editado em</eui-label>
            <eui-input-text
              disabled="true"
              :modelValue="formattedDate.updatedAt"
            />
          </div>
        </div>

        <div>
          <eui-label>Auth token</eui-label>
          <div class="is-flex">
            <eui-input-text
              disabled="true"
              :modelValue="props.instance?.Auth.token"
            />
            <eui-button
              icon="plus"
              color="basic"
              isIcon="true"
              :isLight="true"
              @click="copyToClipboard(props.instance?.Auth.token ?? '')"
            />
          </div>
        </div>

        <div>
          <eui-label>JID</eui-label>
          <div class="is-flex">
            <eui-input-text
              disabled="true"
              :modelValue="props.instance?.ownerJid"
            />
            <eui-button
              icon="plus"
              color="basic"
              isIcon="true"
              :isLight="true"
              @click="copyToClipboard(props.instance?.ownerJid ?? '')"
            />
          </div>
        </div>

        <div>
          <eui-label>Webhook</eui-label>
          <div class="is-flex">
            <eui-input-text
              disabled="true"
              :modelValue="props.instance?.Webhook?.url"
            />
            <eui-button
              icon="plus"
              color="basic"
              isIcon="true"
              :isLight="true"
              @click="copyToClipboard(props.instance?.Webhook?.url ?? '')"
            />
          </div>
        </div>

        <div
          v-if="isOnline"
          class="is-flex is-flex-direction-column is-align-content-center mt-5"
        >
          <figure>
            <p class="is-size-5">Instância conectada</p>
            <img :src="MobileImage" alt="Mobile Image" class="imgWidth" />
          </figure>
        </div>

        <div
          v-else
          class="is-flex is-flex-direction-column is-align-content-center"
        >
          <eui-button
            color="primary"
            :isLoading="isConnectLoading"
            @click="connectInstance"
            isFullwidth
          >
            Novo QR Code
          </eui-button>

          <figure>
            <img v-if="qrCode" :src="qrCode" alt="QR Code" class="imgWidth" />
          </figure>
        </div>

        <eui-button
          color="danger"
          @click="deleteInstance"
          :isLoading="isDeleteLoading"
          isLight
          isFullwidth
        >
          Excluir instância
        </eui-button>

        <eui-button
          icon="whatsapp"
          color="success"
          class="mt-3"
          @click="showModal = true"
          :disabled="instance.connectionStatus !== 'ONLINE'"
          isLight
          isFullwidth
        >
          Enviar mensagem
        </eui-button>
      </div>
    </div>
  </eui-drawer>
  <MessagesModal
    v-if="showModal"
    @close="showModal = false"
    :instance="instance"
  />
</template>

<style>
.imgWidth {
  width: 250px;
}
</style>
