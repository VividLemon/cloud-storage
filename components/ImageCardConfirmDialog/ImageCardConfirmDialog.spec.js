import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import ImageCardConfirmDialog from './ImageCardConfirmDialog.vue'
Vue.use(Vuetify)

describe('ImageCardConfirmDialog.vue', () => {
	const localVue = createLocalVue()
	let vuetify

	beforeEach(() => {
		vuetify = new Vuetify()
	})
	it('No button should close dialog', async () => {
		const wrapper = mount(ImageCardConfirmDialog, {
			localVue,
			vuetify,
			data() {
				return {
					confirmDialog: true
				}
			}
		})
		const button = wrapper.find('#no-button')
		await button.trigger('click')
		expect(wrapper.vm.confirmDialog).toBe(false)
	})
	it('Yes button should close dialog', async () => {
		const wrapper = mount(ImageCardConfirmDialog, {
			localVue,
			vuetify,
			data() {
				return {
					confirmDialog: true
				}
			}
		})
		const button = wrapper.find('#yes-button')
		await button.trigger('click')
		expect(wrapper.vm.confirmDialog).toBe(false)
	})
	it('Yes button should emit', async () => {
		const wrapper = mount(ImageCardConfirmDialog, {
			localVue,
			vuetify,
			data() {
				return {
					confirmDialog: true
				}
			}
		})
		const button = wrapper.find('#yes-button')
		await button.trigger('click')
		expect(wrapper.emitted()['delete-confirm'].length).toBe(1)
	})
	it('span containing name should not exist', () => {
		const wrapper = mount(ImageCardConfirmDialog, {
			localVue,
			vuetify,
			data() {
				return {
					confirmDialog: true
				}
			}
		})
		const text = wrapper.find('.v-card__text > span')
		expect(text.exists()).toBe(false)
	})
	it('span containing name should exist', () => {
		const wrapper = mount(ImageCardConfirmDialog, {
			localVue,
			vuetify,
			data() {
				return {
					confirmDialog: true
				}
			},
			propsData: { name: 'abc' }
		})
		const text = wrapper.find('.v-card__text > span')
		expect(text.exists()).toBe(true)
	})
	it('span containing name should contain name', () => {
		const wrapper = mount(ImageCardConfirmDialog, {
			localVue,
			vuetify,
			data() {
				return {
					confirmDialog: true
				}
			},
			propsData: { name: 'abc' }
		})
		const text = wrapper.find('.v-card__text > span')
		expect(text.text()).toBe('abc')
	})
})
