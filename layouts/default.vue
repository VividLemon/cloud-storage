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
        <Nuxt />
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

<script>
export default {
	name: 'DefaultLayout',
	data() {
		return {
			value: 'gallery',
			navs: [
				{
					value: 'gallery',
					to: 'Gallery',
					text: 'Gallery',
					icon: 'mdi-image-multiple'
				},
				{
					value: 'addItem',
					to: 'AddFile',
					text: 'Add File',
					icon: 'mdi-plus'
				},
				{
					value: 'allFiles',
					to: 'AllFiles',
					text: 'Files',
					icon: 'mdi-file-multiple'
				}
			]
		}
	},
	watch: {
		$route() {
			this.value = this.navs.find((el) => el.to === this.$route.name)?.value ?? this.navs[0].value
		}
	},
	methods: {
		logout() {
			if (this.$auth.loggedIn) {
				this.$auth.logout({ data: { token: this.$auth.strategy.refreshToken.get() } })
			}
		}
	}
}
</script>
