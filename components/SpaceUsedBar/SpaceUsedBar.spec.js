import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import SpaceUsedBar from './SpaceUsedBar.vue'
Vue.use(Vuetify)

describe('ImageCardConfirmDialog.vue', () => {
	const localVue = createLocalVue()
	let vuetify

	beforeEach(() => {
		vuetify = new Vuetify()
	})
	it('space total span should return properly formatted sizes', async () => {
		const wrapper = mount(SpaceUsedBar, {
			localVue,
			vuetify,
			data() {
				return {
					maxSpace: 1
				}
			},
			propsData: { totalSize: 2, warnPercent: 0, warnColor: 'red', okColor: 'blue' }
		})
		const text = wrapper.find('#space-total > span')
		expect(text.text()).toBe('2 Bytes / 1 Bytes total')
		await wrapper.setData({ maxSpace: 1126.4 })
		expect(text.text()).toBe('2 Bytes / 1.1 KB total')
		await wrapper.setData({ maxSpace: 1048576 })
		expect(text.text()).toBe('2 Bytes / 1 MB total')
	})
	it('space total size should be properly formatted', () => {
		const wrapper = mount(SpaceUsedBar, {
			localVue,
			vuetify,
			data() {
				return {
					maxSpace: 1
				}
			},
			propsData: { totalSize: 1024, warnPercent: 0, warnColor: 'red', okColor: 'blue' }
		})
		const text = wrapper.find('#space-total > span')
		expect(text.text()).toBe('1 KB / 1 Bytes total')
	})
	it('Progress bar should contain percentUsed value', async () => {
		const wrapper = mount(SpaceUsedBar, {
			localVue,
			vuetify,
			data() {
				return {
					maxSpace: 1
				}
			},
			propsData: { totalSize: 1024, warnPercent: 0, warnColor: 'red', okColor: 'blue' }
		})
		const item = wrapper.find('.v-progress-linear__determinate')
		expect(item.attributes().style).toContain('width: 100%;')
		await wrapper.setData({ maxSpace: 2048 })
		expect(item.attributes().style).toContain('width: 50%;')
		await wrapper.setData({ maxSpace: 3072 })
		expect(item.attributes().style).toContain('width: 34%;')
		await wrapper.setProps({ totalSize: 2048 })
		expect(item.attributes().style).toContain('width: 67%;')
		await wrapper.setProps({ totalSize: 3072 })
		expect(item.attributes().style).toContain('width: 100%;')
	})
	it('Progress bar should contain correct ok color', async () => {
		const wrapper = mount(SpaceUsedBar, {
			localVue,
			vuetify,
			data() {
				return {
					maxSpace: 2048
				}
			},
			propsData: { totalSize: 1024, warnPercent: 75, warnColor: 'red', okColor: 'blue' }
		})
		const item = wrapper.find('.v-progress-linear__determinate')
		expect(item.classes()).toContain('blue')
		await wrapper.setProps({ okColor: 'purple' })
		expect(item.classes()).toContain('purple')
	})
	it('Progress bar should contain correct warn color', async () => {
		const wrapper = mount(SpaceUsedBar, {
			localVue,
			vuetify,
			data() {
				return {
					maxSpace: 2048
				}
			},
			propsData: { totalSize: 2000, warnPercent: 75, warnColor: 'red', okColor: 'blue' }
		})
		const item = wrapper.find('.v-progress-linear__determinate')
		expect(item.classes()).toContain('red')
		await wrapper.setProps({ warnColor: 'purple' })
		expect(item.classes()).toContain('purple')
	})
	it('Progress bar should contain correct overall color', async () => {
		const wrapper = mount(SpaceUsedBar, {
			localVue,
			vuetify,
			data() {
				return {
					maxSpace: 2048
				}
			},
			propsData: { totalSize: 1024, warnPercent: 75, warnColor: 'red', okColor: 'blue' }
		})
		const item = wrapper.find('.v-progress-linear__determinate')
		expect(item.classes()).toContain('blue')
		await wrapper.setProps({ warnPercent: 1 })
		expect(item.classes()).toContain('red')
	})
	it('Percentused branch returns correct value', async () => {
		const wrapper = mount(SpaceUsedBar, {
			localVue,
			vuetify,
			data() {
				return {
					maxSpace: 0
				}
			},
			propsData: { totalSize: 1024, warnPercent: 75, warnColor: 'red', okColor: 'blue' }
		})
		const item = wrapper.find('.v-progress-linear__determinate')
		expect(item.attributes().style).toContain('width: 0%;')
		await wrapper.setData({ maxSpace: 600 })
		expect(item.attributes().style).toContain('width: 100%;')
	})
	it('Total size format should return 0 Bytes', () => {
		const wrapper = mount(SpaceUsedBar, {
			localVue,
			vuetify,
			data() {
				return {
					maxSpace: 1024
				}
			},
			propsData: { totalSize: 0, warnPercent: 75, warnColor: 'red', okColor: 'blue' }
		})
		const text = wrapper.find('#space-total > span')
		expect(text.text()).toBe('0 Bytes / 1 KB total')
	})
	it('Max space format should return 0 Bytes', () => {
		const wrapper = mount(SpaceUsedBar, {
			localVue,
			vuetify,
			data() {
				return {
					maxSpace: 0
				}
			},
			propsData: { totalSize: 1024, warnPercent: 75, warnColor: 'red', okColor: 'blue' }
		})
		const text = wrapper.find('#space-total > span')
		expect(text.text()).toBe('1 KB / 0 Bytes total')
	})
})
