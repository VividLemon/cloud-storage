<template>
  <div>
    <h1>Add File</h1>
    <v-text-field
      v-model="customName"
      label="Custom name (optional)"
      placeholder="Name"
    />
    <v-file-input
      v-model="$v.files.$model"
      label="File Input"
      :error-messages="filesErrors"
      multiple
      chips
      show-size
      clearable
      counter
      @change="$v.files.$touch()"
      @blur="$v.files.$touch()"
    />
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
	mixins: [validationMixin],
	data() {
		return {
			customName: '',
			files: []
		}
	},
	computed: {
		filesErrors() {
			const errors = []
			if (!this.$v.files.$dirty) return errors
			!this.$v.files.required && errors.push('A file is required to upload')
			return errors
		}
	},
	validations: {
		files: {
			required
		}
	},
	methods: {
		submit() {
			this.$v.form.$touch()
			if (this.$v.form.$anyError) { return }
			// On enter, fetch space on disk, check if current space on disk + file size > max file
			// If it is, display snackbar, otherwise upload
			// Check if storage space is full, if it is, display snackbar
			// Otherwise upload
			return true
		}
	}
}
</script>

<style>

</style>
