<template>
  <v-container>
    <v-row dense>
      <v-col>
        {{ totalSizeFormatted }} / {{ maxSpaceFormatted }} total
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <v-progress-linear :value="percentUsed" :color="(percentUsed > warnPercent) ? warnColor : okColor" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		totalSize: {
			type: Number,
			default: 0
		},
		maxSpace: {
			type: Number,
			default: 0
		},
		warnPercent: {
			type: Number,
			default: 75
		},
		warnColor: {
			type: String,
			default: 'red'
		},
		okColor: {
			type: String,
			default: 'blue'
		}
	},
	computed: {
		percentUsed(): number {
			return Math.ceil(this.totalSize / this.maxSpace)
		},
		totalSizeFormatted(): string {
			if (this.totalSize === 0) return '0 Bytes'
			const k = 1024
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
			const i = Math.floor(Math.log(this.totalSize) / Math.log(k))
			return `${Number.parseFloat((this.totalSize / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
		},
		maxSpaceFormatted(): string {
			if (this.maxSpace === 0) return '0 Bytes'
			const k = 1024
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
			const i = Math.floor(Math.log(this.maxSpace) / Math.log(k))
			return `${Number.parseFloat((this.maxSpace / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
		}
	}
})
</script>

<style>

</style>
