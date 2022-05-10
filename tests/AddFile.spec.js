import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import AddFile from '../pages/add-file.vue'

Vue.use(Vuetify)

describe('add-file', () => {
	const localVue = createLocalVue()
	let vuetify
	beforeEach(() => {
		vuetify = new Vuetify()
	})
	it('Button should fire when clicked', async () => {
		const wrapper = mount(AddFile, {
			localVue,
			vuetify
		})
		const spy = (wrapper.vm.submit = jest.fn())
		const button = wrapper.find('#add-file-button')
		expect(spy).toHaveBeenCalledTimes(0)
		await button.trigger('click')
		expect(spy).toHaveBeenCalledTimes(1)
	})
})
