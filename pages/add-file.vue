<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Add File</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="customName"
          label="Custom name (optional)"
          placeholder="Name"
          :disabled="($v.files.$model.length > 1) ? true : false"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-file-input
          id="file-input"
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
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- TODO there will be a shown optional checkbox that only appears when there is at least one image in files. That will determine if server should compress images -->
        <v-btn id="add-file-button" @click="submit()">
          Add file
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" color="error" top>
      The space is too full to upload this
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default Vue.extend({
	name: 'AddFile',
	mixins: [validationMixin],
	data(): {customName: string, files: Array<File>, snackbar: boolean, photoTypes: Array<string>} {
		return {
			customName: '',
			files: [],
			snackbar: false,
			photoTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
		}
	},
	computed: {
		filesErrors(): Array<string> {
			const errors: Array<string> = []
			if (!this.$v.files.$dirty) return errors
			!this.$v.files.required && errors.push('A file is required to upload')
			return errors
		},
		filesContainsPicture(): boolean {
			for (let index = 0; index < this.files.length; index++) {
				const element = this.files[index]
				for (let ind = 0; ind < this.photoTypes.length; ind++) {
					const el = this.photoTypes[ind]
					if (el === element.type) {
						return true
					}
				}
			}
			return false
		}
	},
	watch: {
		files(): void {
			if (this.files.length > 1) {
				this.customName = ''
			}
		}
	},
	validations: {
		files: {
			required
		}
	},
	methods: {
		async submit(): Promise<void> {
			this.$v.$touch()
			if (this.$v.$anyError) { }
			// await this.$axios.$post('/api/upload')
			// TODO upload file
			// Get compress image modifier, if it is true, send that with it.
			// this.$axios.$post('/api/upload')
			// On enter, fetch space on disk, check if current space on disk + file size > max file
			// If it is, display snackbar, otherwise upload
			// Check if storage space is full, if it is, display snackbar
			// Otherwise upload
		}
	}
})
</script>

<style>

</style>
