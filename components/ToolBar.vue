<template>
  <v-card>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col>
          <v-btn-toggle v-model="filtered" multiple @change="$emit('filterChanged', filteredValues)">
            <v-btn v-for="(type, index) in fileTypes" :key="index">
              {{ type }}
            </v-btn>
          </v-btn-toggle>
          <sync-icon :refreshing="refreshing" @refresh-clicked="$emit('refresh-clicked')" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import SyncIcon from './SyncIcon.vue'
export default Vue.extend({
	components: { SyncIcon },
	props: {
		fileTypes: {
			type: Array,
			default: () => {
				return []
			}
		},
		refreshing: {
			type: Boolean,
			default: false
		}
	},
	data(): {filtered: Array<number>} {
		return {
			filtered: []
		}
	},
	computed: {
		filteredValues(): Array<string> {
			return this.filtered.map((index) => (this.fileTypes as Array<string>)[index])
		}
	}
})
</script>

<style>

</style>
