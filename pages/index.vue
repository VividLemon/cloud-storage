<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col>
          <h2>Login</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="$v.username.$model"
            label="Username"
            autofocus
            autocomplete="username"
            :error-messages="usernameErrors"
            error-count="1"
            @input="$v.username.$touch"
            @keydown.enter="login"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="$v.password.$model"
            label="Password"
            type="password"
            autocomplete="current-password"
            :error-messages="passwordErrors"
            error-count="1"
            @input="$v.password.$touch"
            @keydown.enter="login"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn :loading="loading" @click="login">
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      top
      color="error"
      timeout="4000"
    >
      Incorrect login
    </v-snackbar>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default Vue.extend({
	name: 'IndexPage',
	mixins: [validationMixin],
	data(): {username: string, password: string, loading: boolean, snackbar: boolean} {
		return {
			username: '',
			password: '',
			loading: false,
			snackbar: false
		}
	},
	computed: {
		usernameErrors(): Array<string> {
			const errors: Array<string> = []
			if (!this.$v.username.$dirty) { return errors }
			!this.$v.username.required && errors.push('Field required')
			return errors
		},
		passwordErrors(): Array<string> {
			const errors: Array<string> = []
			if (!this.$v.password.$dirty) { return errors }
			!this.$v.password.required && errors.push('Field required')
			return errors
		}
	},
	validations: {
		username: {
			required
		},
		password: {
			required
		}
	},
	beforeCreate(): void {
		if (this.$auth.loggedIn) {
			this.$router.push('gallery')
		}
	},
	methods: {
		async login(): Promise<void> {
			this.$v.$touch()
			if (this.$v.$anyError) { return }
			this.loading = true
			try {
				await this.$auth.loginWith('local', { data: { name: this.username, password: this.password } })
			}
			catch (err) {
				this.snackbar = true
			}
			finally {
				this.loading = false
			}
		}
	}
})
</script>
