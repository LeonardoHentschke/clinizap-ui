<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Instance } from '@/types/Instance';
import { InstanceService } from '@/api/InstanceApi';
import Header from '@/components/Header.vue';
import InstanceDrawer from '@/components/InstanceDrawer.vue';
import NewInstanceModal from '@/components/NewInstanceModal.vue';
import InstanceTable from '@/components/InstanceTable.vue';

const syncMessagesOptions = [
  { name: 'Todos', id: undefined },
  { name: 'Ativado', id: true },
  { name: 'Desativado', id: false },
];

const connectionStatusOptions = [
  { name: 'Todos', id: '' },
  { name: 'Online', id: 'ONLINE' },
  { name: 'Offline', id: 'OFFLINE' },
];

const showModal = ref(false);
const showDrawer = ref(false);
const searchQuery = ref('');
const selectedSyncMessages = ref();
const selectedConnectionStatus = ref('');

const instances = ref<Instance[]>();
const selectedInstance = ref<Instance | null>();

onMounted(() => {
  fetchInstances();
});

const fetchInstances = async () => {
  try {
    const { data } = await InstanceService.fetchInstances();
    instances.value = data;
  } catch (error) {
    console.error('Error fetching instances:', error);
  }
};

const logoutInstance = async (instance: Instance) => {
  try {
    await InstanceService.logoutInstance(instance.name, instance.Auth.token);
  } catch (error: any) {
    alert(JSON.stringify(error.response.data, null, 2));
  }

  fetchInstances();
};

const reloadInstance = async (instance: Instance) => {
  try {
    await InstanceService.reloadInstance(instance.name, instance.Auth.token);
  } catch (error: any) {
    alert(JSON.stringify(error.response.data, null, 2));
  }

  fetchInstances();
};

const openDrawer = (instance: Instance) => {
  selectedInstance.value = instance;
  showDrawer.value = true;
};

const closeDrawer = () => {
  showDrawer.value = false;
  selectedInstance.value = null;
  fetchInstances();
};

const removeInstance = (instanceName: string) => {
  instances.value = instances.value?.filter(
    (instance) => instance.name !== instanceName,
  );
};

const filteredInstances = computed(() => {
  if (!instances.value) return [];

  return instances.value.filter((instance) => {
    const matchesName = instance.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const matchesSyncMessages = selectedSyncMessages.value === undefined 
      || instance.syncMessages == selectedSyncMessages.value;

    const matchesConnectionStatus = selectedConnectionStatus.value === ''
      || instance.connectionStatus === selectedConnectionStatus.value;

    return matchesName && matchesSyncMessages && matchesConnectionStatus;
  });
});

const connectedInstancesCount = computed(() => {
  if (!instances.value) return 0;
  return instances.value.filter(
    (instance) => instance.connectionStatus === 'ONLINE',
  ).length;
});

const disconnectedInstancesCount = computed(() => {
  if (!instances.value) return 0;
  return instances.value.filter(
    (instance) => instance.connectionStatus !== 'ONLINE',
  ).length;
});
</script>

<template>
  <InstanceDrawer
    v-if="showDrawer && selectedInstance"
    :instance="selectedInstance"
    @close="closeDrawer"
    @deleted="removeInstance"
  />

  <NewInstanceModal
    v-if="showModal"
    @close="showModal = false"
    @created="fetchInstances"
  />

  <Header color="primary">
    <template #middle>
      <div class="columns is-gapless">
        <div class="column">
          <h1 class="is-size-3 has-text-white">Clinizap</h1>
        </div>
        <div class="column">
          <eui-icon icon="whatsapp" size="large" />
        </div>
      </div>
    </template>
  </Header>

  <div class="content-wrapper">
    <div class="container mb-4">
      <div class="columns">
        <div class="column is-half">
          <eui-input-search
            placeholder="Pesquise por nome"
            v-model="searchQuery"
          />
        </div>
        <div class="column">
          <eui-button color="primary" @click="showModal = true" icon="whatsapp">
            Nova instância
          </eui-button>
        </div>
        <div class="column">
          <eui-label>
            Instâncias conectadas: {{ connectedInstancesCount }}
          </eui-label>
          <eui-label>
            Instâncias desconectadas: {{ disconnectedInstancesCount }}
          </eui-label>
        </div>
        <div class="column">
          <eui-label>
            Instâncias total: {{ instances?.length }}
          </eui-label
          >
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-6">
          <eui-input-select
            v-model="selectedSyncMessages"
            :options="syncMessagesOptions"
            placeholder="Filtrar sync"
            isFixed           
          />
    
        </div>
        <div class="column is-6">
          <eui-input-select
            v-model="selectedConnectionStatus"
            :options="connectionStatusOptions"
            placeholder="Filtrar status"
            isFixed
          />
        </div>
      </div>
    </div>

    <InstanceTable
      :instances="filteredInstances"
      @openDrawer="openDrawer"
      @logoutInstance="logoutInstance"
      @reloadInstance="reloadInstance"
    />
  </div>
</template>

<style>
.content-wrapper {
  margin-top: 90px;
}

.multiselect__content {
  width: 100%;
}
</style>
