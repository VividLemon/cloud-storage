<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <space-used-bar :max-space="maxSpace" :total-size="totalSize" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <tool-bar
            :file-types="allTypes"
            :refreshing="refreshing"
            @filterChanged="handleFilterChange"
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
          <image-card :item="item" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ImageCard from '~/components/ImageCard.vue'
import SpaceUsedBar from '~/components/SpaceUsedBar.vue'
import ToolBar from '~/components/ToolBar.vue'
export default {
	name: 'HomePage',
	components: { ToolBar, ImageCard, SpaceUsedBar },
	data() {
		return {
			files: [],
			totalSize: 0,
			imagesSize: 0,
			maxLength: 2,
			filter: [],
			refreshing: false,
			maxSpace: 1000000000
		}
	},
	async fetch() {
		try {
			this.refreshing = true
			this.files = await this.$axios.$get('/api/system/images')
			const { imagesSize, othersSize } = await this.$axios.$get('/api/system/all-size')
			this.imagesSize = imagesSize
			this.totalSize = imagesSize + othersSize
		}
		catch (err) {
			this.$nuxt.error()
		}
		finally {
			this.refreshing = false
		}
	},
	computed: {
		allTypes() {
			const map = this.files.map((el) => el.slice(el.lastIndexOf('.') + 1).toLowerCase())
			return [...new Set(map)]
		}
	},
	methods: {
		handleFilterChange(filter) {
			this.filter = filter
		},
		isFiltered(item) {
			return (this.filter.length) ? this.filter.includes(item.slice(item.lastIndexOf('.') + 1).toLowerCase()) : true
		}
	}
}
</script>
