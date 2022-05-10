import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import AllFiles from '../pages/all-files.vue'

Vue.use(Vuetify)

describe('AllFiles.vue', () => {
	const localVue = createLocalVue()
	let vuetify

	beforeEach(() => {
		vuetify = new Vuetify()
	})
	// TODO
	it('Btn toggle should emit filteredValues on change', async () => {
		const wrapper = mount(AllFiles, {
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
	// refresh click should cause fetch
	// add file v-btn should push to page
	// delete item v-btn should cause dialog
	// delete item dialog should close on no
	// delete item dialog should start delete on yes
	// snackbar button should close snackbar on click
	// fetch start refreshing data
	// fetch should stop refreshing data
	// all types should return no duplicates
	// Filtered array by type should return correct
	// file array to table should map correct
	// delete item makes edit item the file
	// delete item start makes delite item dialog
	//  delte item confirmed closes first dialog
	// edit item null creates snackbar
	// otherwise deltes the item
	// deletes item does fetch on end
	// error causes a snackbar response
	// success causes snackbar response
})
