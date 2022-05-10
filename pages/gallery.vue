<template>
  <v-container>
    <v-row dense>
      <v-col>
        <space-used-bar :total-size="totalSize" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <tool-bar
          v-model="filter"
          :file-types="allTypes"
          :refreshing="refreshing"
          @refresh-clicked="$fetch"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="(item, index) in files"
        v-show="isFiltered(item)"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <image-card
          :item="item"
          @delete-confirm="deleteItem(item)"
        />
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.snack"
      :color="snackbar.color"
      top
    >
      {{ snackbar.text }}
      <template #action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar.snack = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import ImageCard from '~/components/ImageCard/ImageCard.vue'
import SpaceUsedBar from '~/components/SpaceUsedBar/SpaceUsedBar.vue'
import ToolBar from '~/components/ToolBar/ToolBar.vue'
export default Vue.extend({
	name: 'GalleryPage',
	components: { ToolBar, ImageCard, SpaceUsedBar },
	data(): {files: Array<string>, totalSize: number, filter: Array<string>, refreshing: boolean, snackbar: {snack: boolean, text: string, color: string}} {
		return {
			files: [],
			totalSize: 0,
			filter: [],
			refreshing: false,
			snackbar: {
				snack: false,
				text: '',
				color: 'primary'
			}
		}
	},
	async fetch(): Promise<void> {
		try {
			this.refreshing = true
			this.files = await this.$axios.$get('/api/system/images')
			const { imagesSize, othersSize } = await this.$axios.$get('/api/system/all-size')
			this.totalSize = imagesSize + othersSize
		}
		catch (err: any) {
			this.$nuxt.error({ message: err })
		}
		finally {
			this.refreshing = false
		}
	},
	computed: {
		allTypes(): Array<string> {
			const map = this.files.map((el) => el.slice(el.lastIndexOf('.') + 1).toLowerCase())
			return [...new Set(map)]
		}
	},
	methods: {
		isFiltered(item: string): boolean {
			return (this.filter.length) ? this.filter.includes(item.slice(item.lastIndexOf('.') + 1).toLowerCase()) : true
		},
		async deleteItem(file: string): Promise<void> {
			try {
				const response = await this.$axios.$delete('/api/upload/', {
					data: { file }
				})
				this.snackbar.text = response
				this.snackbar.color = 'success'
				this.snackbar.snack = true
			}
			catch (err: any) {
				this.snackbar.text = `Error: ${err?.response?.data ?? 'No response'}`
				this.snackbar.color = 'error'
				this.snackbar.snack = true
			}
			finally {
				this.$fetch()
			}
		}
	}
})
</script>
