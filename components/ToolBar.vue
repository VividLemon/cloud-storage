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

<script>
import SyncIcon from './SyncIcon.vue'
export default {
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
	emits: ['filterChanged', 'refresh-clicked'],
	data() {
		return {
			filtered: []
		}
	},
	computed: {
		filteredValues() {
			return this.filtered.map((index) => this.fileTypes[index])
		}
	}
}
</script>

<style>

</style>
