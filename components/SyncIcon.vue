<template>
  <v-btn
    :loading="refreshing"
    tile
    text
    elevation="0"
    aria-label="Refresh items"
    @click="$emit('refresh-clicked')"
  >
    <v-icon color="cyan">
      mdi-sync
    </v-icon>
    <template #loader>
      <v-progress-circular
        indeterminate
        color="cyan"
        width="3"
        size="24"
      />
    </template>
  </v-btn>
</template>

<script>
export default {
	props: {
		refreshing: {
			type: Boolean,
			default: false
		}
	},
	emits: ['refresh-clicked']
}
</script>

<style>

</style>
