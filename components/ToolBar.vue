<template>
  <v-sheet>
    <v-container>
      <v-row align="center" justify="center" dense>
        <v-col>
          <v-btn-toggle v-model="filtered" multiple @change="$emit('input', filteredValues)">
            <v-btn v-for="(type, index) in fileTypes" :key="index">
              {{ type }}
            </v-btn>
          </v-btn-toggle>
          <sync-icon :refreshing="refreshing" @refresh-clicked="$emit('refresh-clicked')" />
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import SyncIcon from './SyncIcon.vue'
export default Vue.extend({
	components: { SyncIcon },
	props: {
		value: {
			type: Array,
			default: () => {
				return []
			}
		},
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
			filtered: this.value as Array<number>
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
