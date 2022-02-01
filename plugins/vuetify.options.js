import colors from 'vuetify/es5/util/colors'
import LRU from 'lru-cache'
const themeCache = new LRU({
	max: 500,
	length(n, key) { return n * 2 + key.length },
	dispose(_key, n) { n.close() },
	maxAge: 1000 * 60 * 60 * 24 * 31
})

export default {
	customVariables: ['~/assets/variables.scss'],
	theme: {
		options: {
			themeCache
		},
		dark: true,
		themes: {
			dark: {
				primary: colors.blue.darken2,
				accent: colors.grey.darken3,
				secondary: colors.amber.darken3,
				info: colors.teal.lighten1,
				warning: colors.amber.base,
				error: colors.deepOrange.accent4,
				success: colors.green.accent3
			}
		}
	}
}
