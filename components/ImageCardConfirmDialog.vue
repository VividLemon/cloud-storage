<template>
  <v-dialog v-model="confirmDialog" width="350">
    <template #activator="{on, attrs}">
      <v-btn
        color="error"
        bottom
        right
        fab
        fixed
        aria-label="Delete"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>
          mdi-delete
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Are you sure?
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete<span v-if="name.length" class="primary--text text-decoration-underline"> {{ name }}</span>?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="confirmDialog = false">
          No
        </v-btn>
        <v-btn color="error">
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		name: {
			type: String,
			default: ''
		}
	},
	data(): {confirmDialog: boolean} {
		return {
			confirmDialog: false
		}
	}
})
</script>

<style>

</style>
