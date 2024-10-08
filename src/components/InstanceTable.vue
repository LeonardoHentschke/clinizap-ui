<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Instance } from '@/types/Instance';
import genericImg from '@/assets/img/generic-128.png';

defineProps<{
  instances: Instance[];
}>();

const emit = defineEmits<{
  (e: 'openDrawer', instance: Instance): void;
  (e: 'logoutInstance', instance: Instance): void;
  (e: 'reloadInstance', instance: Instance): void;
}>();
</script>

<template>
  <div class="container">
    <table
      class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
    >
      <thead>
        <tr>
          <th class="has-text-centered">ID</th>
          <th class="has-text-centered">Nome</th>
          <th class="has-text-centered">Sincronizar mensagens</th>
          <th class="has-text-centered">Status de Conexão</th>
          <th class="has-text-centered">Foto de Perfil</th>
          <th class="has-text-centered">Criado Em</th>
          <th class="has-text-centered">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="instance in instances" :key="instance.id">
          <td class="has-text-centered is-vcentered">{{ instance.id }}</td>
          <td class="has-text-centered is-vcentered">{{ instance.name }}</td>
          <td
            class="has-text-centered is-vcentered"
            :class="
                instance.syncMessages === true
                  ? 'has-text-success'
                  : 'has-text-danger'
              "
          >{{ instance.syncMessages }}</td>
          <td
            class="has-text-centered is-vcentered"
            :class="
              instance.connectionStatus === 'ONLINE'
                ? 'has-text-success'
                : 'has-text-danger'
            "
          >
            {{ instance.connectionStatus }}
          </td>
          <td>
            <figure class="image is-64x64">
              <img
                v-if="instance.profilePicUrl"
                :src="instance.profilePicUrl"
                alt="Profile Pic WhatsApp"
                class="is-rounded"
              />
              <img
                v-else
                :src="genericImg"
                alt="generic img"
                class="is-rounded"
              />
            </figure>
          </td>
          <td class="has-text-centered is-vcentered">
            {{ new Date(instance.createdAt).toLocaleDateString() }}
          </td>
          <td>
            <div class="is-flex is-flex-direction-column is-align-content-center gap">
              <eui-button
                color="primary"
                size="small"
                @click="() => emit('openDrawer', instance)"
                icon="eye"
              >
                Ver detalhes
              </eui-button>
              <div class="is-full is-flex is-justify-content-center gap">
                <eui-button
                  isLight
                  color="danger"
                  size="small"
                  @click="() => emit('logoutInstance', instance)"
                  icon="times"
                  :disabled="instance.connectionStatus === 'ONLINE' ? false : true"
                >
                  Desconectar
                </eui-button>
                <eui-button
                  isLight
                  color="primary"
                  size="small"
                  @click="() => emit('reloadInstance', instance)"
                  icon="rotate-right"
                  :disabled="instance.connectionStatus === 'ONLINE' ? false : true"
                >
                  Reiniciar
                </eui-button>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.gap {
  gap: 5px;
}
</style>
