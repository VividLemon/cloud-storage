import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Index from '../pages/index.vue'

Vue.use(Vuetify)

describe('Index.vue', () => {
	const localVue = createLocalVue()
	let vuetify

	beforeEach(() => {
		vuetify = new Vuetify()
	})
	// TODO
	it('Btn toggle should emit filteredValues on change', async () => {
		const wrapper = mount(Index, {
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
	// V-text-field should contain errors
	// v-text-fields on enter should cause login
	// v-btn should cause login
	// Incorrect login should cause snackbar
	// Login should stop loading data
	// Login should start loading data
})
