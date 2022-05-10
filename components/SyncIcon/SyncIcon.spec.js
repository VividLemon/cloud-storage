import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import SyncIcon from './SyncIcon.vue'

Vue.use(Vuetify)

describe('SyncIcon.vue', () => {
	const localVue = createLocalVue()
	let vuetify

	beforeEach(() => {
		vuetify = new Vuetify()
	})
	it('Button should emit when clicked', async () => {
		const wrapper = mount(SyncIcon, {
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
	// TODO V-progress circular should exist when true
	// Not when false
})
