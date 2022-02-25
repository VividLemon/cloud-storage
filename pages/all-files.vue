<template>
  <v-container>
    <v-row>
      <v-col>
        <space-used-bar :total-size="totalSize" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <tool-bar
          v-model="filter"
          :file-types="allTypes"
          :refreshing="refreshing"
          @refresh-clicked="$fetch"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model.trim="searchQuery"
          label="Search"
          placeholder="Search"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          :headers="table.headers"
          :items="fileArrayToTable"
          :search="searchQuery"
        >
          <template #top>
            <v-toolbar>
              <v-toolbar-title>Files</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-spacer />
              <v-btn to="add-file">
                Add File
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.actions="{item}">
            <v-btn v-if="false" icon aria-label="Edit item">
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn
              icon
              color="error"
              aria-label="Delete item"
              @click="deleteItemStart(item.file)"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="deleteItemDialog" width="500">
      <v-card>
        <v-card-title>
          Confirm Delete?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteItemDialog = false">
            No
          </v-btn>
          <v-btn color="error" @click="deleteItemConfirmed">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar.snack"
      :color="snackbar.color"
      top
    >
      {{ snackbar.text }}
      <template #action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar.snack = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import SpaceUsedBar from '~/components/SpaceUsedBar.vue'
import ToolBar from '~/components/ToolBar.vue'
export default Vue.extend({
	name: 'GalleryPage',
	components: { ToolBar, SpaceUsedBar },
	data(): {files: Array<string>, totalSize: number, editItem: null | string, filter: Array<string>, searchQuery: string, refreshing: boolean, snackbar: {snack: boolean, text: string, color: string}, table: {headers: Array<{text: string, align?: string, sortable?: boolean, value: string}>}, deleteItemDialog: boolean} {
		return {
			files: [],
			totalSize: 0,
			filter: [],
			searchQuery: '',
			refreshing: false,
			editItem: null,
			deleteItemDialog: false,
			snackbar: {
				snack: false,
				text: '',
				color: 'primary'
			},
			table: {
				headers: [
					{ text: 'File', value: 'file' },
					{ text: 'Actions', value: 'actions', sortable: false }
				]
			}
		}
	},
	async fetch() {
		this.refreshing = true
		try {
			const { images, other } = await this.$axios.$get('/api/system/all')
			this.files = [...images, ...other]
			const { imagesSize, othersSize } = await this.$axios.$get('/api/system/all-size')
			this.totalSize = imagesSize + othersSize
		}
		catch (err: any) {
			this.$nuxt.error({ message: err })
		}
		finally {
			this.refreshing = false
		}
	},
	computed: {
		allTypes(): Array<string> {
			const map = this.files.map((el) => el.slice(el.lastIndexOf('.') + 1).toLowerCase())
			return [...new Set(map)]
		},
		filteredArrayByType(): Array<string> {
			return (this.filter.length) ? this.files.filter((el) => this.filter.includes(el.slice(el.lastIndexOf('.') + 1).toLowerCase())) : this.files
		},
		fileArrayToTable(): Array<{file: string}> {
			return this.filteredArrayByType.map((el) => ({ file: el }))
		}
	},
	methods: {
		deleteItemStart(file: string): void {
			this.editItem = file
			this.deleteItemDialog = true
		},
		async deleteItemConfirmed(): Promise<void> {
			this.deleteItemDialog = false
			if (this.editItem == null) {
				this.snackbar.text = 'System error, edit item is undefined'
				this.snackbar.color = 'error'
				this.snackbar.snack = true
				return
			}
			try {
				const [folder, item] = this.editItem.split('\\')
				const response = await this.$axios.$delete('/api/upload/', {
					data: { folder, item }
				})
				this.snackbar.text = response
				this.snackbar.color = 'success'
				this.snackbar.snack = true
			}
			catch (err: any) {
				this.snackbar.text = `Error: ${err?.response?.data ?? 'No response'}`
				this.snackbar.color = 'error'
				this.snackbar.snack = true
			}
			finally {
				this.$fetch()
			}
		}
	}
})
</script>
