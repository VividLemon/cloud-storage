import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import ToolBar from './ToolBar.vue'

Vue.use(Vuetify)

describe('ToolBar.vue', () => {
	const localVue = createLocalVue()
	let vuetify

	beforeEach(() => {
		vuetify = new Vuetify()
	})
	// TODO
	it('Btn toggle should emit filteredValues on change', async () => {
		const wrapper = mount(ToolBar, {
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
	// V btn toggle should contain fileTypes as children
	// Sync icon should emit refresh clicked
	// Filtered values should return values
	// filtered in data should be prop value on start
	// vbtn toggle should emit on change
})
