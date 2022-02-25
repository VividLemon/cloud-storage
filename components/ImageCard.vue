<template>
  <v-dialog v-model="dialog" fullscreen>
    <template #activator="{on, attrs}">
      <v-card v-bind="attrs" v-on="on">
        <v-img
          :src="`/api/public/${item}`"
          height="250"
          lazy-src="/placeholder.png"
          position="top"
        >
          <template #placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="cyan"
              />
            </v-row>
          </template>
        </v-img>
        <v-card-title>
          {{ fileName }}
        </v-card-title>
      </v-card>
    </template>
    <v-card>
      <v-toolbar
        color="primary"
      >
        <v-btn
          icon
          aria-label="Close"
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ item }}
        </v-toolbar-title>
      </v-toolbar>
      <v-img
        :src="`/api/public/${item}`"
        max-height="75vh"
        contain
        class="ma-2"
      />
    </v-card>
    <image-card-confirm-dialog
      :name="item"
      @delete-confirm="deleteConfirm"
    />
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import ImageCardConfirmDialog from './ImageCardConfirmDialog.vue'
export default Vue.extend({
	components: { ImageCardConfirmDialog },
	props: {
		item: {
			type: String,
			required: true
		}
	},
	data(): {dialog: boolean} {
		return {
			dialog: false
		}
	},
	computed: {
		fileName(): string {
			return this.item.slice(this.item.lastIndexOf('/') + 1)
		}
	},
	methods: {
		deleteConfirm() {
			this.$emit('delete-confirm')
			this.dialog = false
		}
	}
})
</script>

<style>

</style>
