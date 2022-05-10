import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Gallery from '../pages/gallery.vue'

Vue.use(Vuetify)

describe('Gallery.vue', () => {
	const localVue = createLocalVue()
	let vuetify

	beforeEach(() => {
		vuetify = new Vuetify()
	})
	// TODO
	it('Btn toggle should emit filteredValues on change', async () => {
		const wrapper = mount(Gallery, {
			localVue,
			vuetify,
			propsData: {
				refreshing: false
			}
		})
		const button = wrapper.find('#sync-button')
		await button.trigger('click')
		expect(wrapper.emitted()['refresh-clicked'].length).toBe(1)
	})
	// toolbar emit refresh click should cause fetch
	// image card delete confirm should cause delete item
	// v-btn in snackbar should close snackbar
	// Alltypes computed should no repeat values
	// is filtered should return value
	// delete item should fetch on end
	// Delete item should return correct snackbar on success
	// Delete item should return correct snackbar on error
})
