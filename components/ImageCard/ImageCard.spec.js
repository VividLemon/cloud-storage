import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import ImageCardConfirmDialog from '../ImageCardConfirmDialog/ImageCardConfirmDialog.vue'
import ImageCard from './ImageCard.vue'

Vue.use(Vuetify)

describe('ImageCard.vue', () => {
	const localVue = createLocalVue()
	let vuetify

	beforeEach(() => {
		vuetify = new Vuetify()
	})
	it('file name should return correct text', () => {
		const wrapper = mount(ImageCard, {
			localVue,
			vuetify,
			propsData: {
				item: 'path/file.js'
			}
		})
		const text = wrapper.find('.v-card__title > span')
		expect(text.text()).toBe('file.js')
	})
	it('file name should return full string', () => {
		const wrapper = mount(ImageCard, {
			localVue,
			vuetify,
			propsData: {
				item: 'pathtofile.js'
			}
		})
		const text = wrapper.find('.v-card__title > span')
		expect(text.text()).toBe('pathtofile.js')
	})
	it('file name should return empty string', () => {
		const wrapper = mount(ImageCard, {
			localVue,
			vuetify,
			propsData: {
				item: ''
			}
		})
		const text = wrapper.find('.v-card__title > span')
		expect(text.text()).toBe('')
	})
	it('Confirm dialog emit should cause parent to emit', () => {
		const wrapper = mount(ImageCard, {
			localVue,
			vuetify,
			data() {
				return {
					dialog: true
				}
			},
			propsData: { item: '' }
		})
		wrapper.findComponent(ImageCardConfirmDialog).vm.$emit('delete-confirm')
		expect(wrapper.emitted()['delete-confirm'].length).toBe(1)
	})
	it('Confirm dialog should close parent dialog', () => {
		const wrapper = mount(ImageCard, {
			localVue,
			vuetify,
			data() {
				return {
					dialog: true
				}
			},
			propsData: { item: '' }
		})
		wrapper.findComponent(ImageCardConfirmDialog).vm.$emit('delete-confirm')
		expect(wrapper.vm.dialog).toBe(false)
	})
})
