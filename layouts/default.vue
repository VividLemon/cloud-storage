<template>
  <v-app dark>
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title>
        <NuxtLink class="text-decoration-none white--text" to="Gallery" :no-prefetch="true">
          Storage
        </NuxtLink>
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        v-show="$auth.loggedIn"
        color="warning"
        text
        @click="logout"
      >
        Logout
        <v-icon aria-hidden="true">
          mdi-logout-variant
        </v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="mb-14">
        <Nuxt keep-alive :keep-alive-props="{ max: 10 }" />
        <!-- TODO see if this causes issues in the future -->
      </v-container>
    </v-main>
    <v-bottom-navigation
      v-show="$auth.loggedIn"
      v-model="value"
      fixed
      shift
    >
      <v-btn
        v-for="(item, index) in navs"
        :key="index"
        :value="item.value"
        :to="item.to"
      >
        <span>{{ item.text }}</span>
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script lang="ts">
import { RefreshableScheme } from '@nuxtjs/auth-next'
import Vue from 'vue'
export default Vue.extend({
	name: 'DefaultLayout',
	data(): {value: string, navs: Array<{value: string, to: string, text: string, icon: string}>} {
		return {
			value: 'gallery',
			navs: [
				{
					value: 'gallery',
					to: 'gallery',
					text: 'Gallery',
					icon: 'mdi-image-multiple'
				},
				{
					value: 'addItem',
					to: 'add-file',
					text: 'Add File',
					icon: 'mdi-plus'
				},
				{
					value: 'allFiles',
					to: 'all-files',
					text: 'Files',
					icon: 'mdi-file-multiple'
				}
			]
		}
	},
	watch: {
		$route(): void {
			this.value = this.navs.find((el) => el.to === this.$route.name)?.value ?? this.navs[0].value
		}
	},
	methods: {
		async logout(): Promise<void> {
			try {
				if (this.$auth.loggedIn) {
					await this.$auth.logout({ data: { token: (this.$auth.strategy as RefreshableScheme).refreshToken.get() } })
				}
			}
			catch (err: any) {
				this.$nuxt.error({ message: err })
			}
		}
	}
})
</script>
