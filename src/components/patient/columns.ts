import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, Trash2 } from 'lucide-vue-next'
import type { Patient } from '@/types/patient/patient'
import { RouterLink, useRouter } from 'vue-router'

// Helper function to get the correct sort icon
function getSortIcon(column: any) {
  const sortDirection = column.getIsSorted()
  if (sortDirection === 'asc') return ArrowUp
  if (sortDirection === 'desc') return ArrowDown
  return ArrowUpDown
}
const DEFAULT_COLUMN_WIDTH = 150
const router = useRouter()
export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const SortIcon = getSortIcon(column)
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
          class: 'hover:bg-muted',
        },
        () => [
          'Name',
          h(SortIcon, {
            class: `ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-blue-600' : 'text-muted-foreground'}`,
          }),
        ],
      )
    },
    cell: ({ row }) => {
      const patient = row.original
      return h('div', [
        h('div', { class: 'font-semibold mx-3 my-2' }, `${patient.firstName} ${patient.lastName}`),
      ])
    },
    filterFn: (row, id, value) => {
      if (!value) return true
      const patient = row.original as Patient
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
      return fullName.includes(value.toLowerCase())
    },
    size: DEFAULT_COLUMN_WIDTH,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => {
      const SortIcon = getSortIcon(column)
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
          class: 'hover:bg-muted',
        },
        () => [
          'Status',
          h(SortIcon, {
            class: `ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-blue-600' : 'text-muted-foreground'}`,
          }),
        ],
      )
    },
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return h(
        Badge,
        {
          variant: isActive ? 'default' : 'secondary',
          class: isActive
            ? 'mx-2 bg-green-100 text-green-800 hover:bg-green-100'
            : 'mx-2 bg-red-100 text-red-800 hover:bg-red-100',
        },
        () => (isActive ? 'Active' : 'Inactive'),
      )
    },
    filterFn: (row, id, value) => {
      if (value === 'all') return true
      if (value === 'active') return row.getValue(id) === true
      if (value === 'inactive') return row.getValue(id) === false
      return true
    },
    size: DEFAULT_COLUMN_WIDTH,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      const SortIcon = getSortIcon(column)
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
          class: 'hover:bg-muted',
        },
        () => [
          'Created',
          h(SortIcon, {
            class: `ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-blue-600' : 'text-muted-foreground'}`,
          }),
        ],
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return h('div', { class: 'text-muted-foreground mx-3' }, date.toLocaleDateString())
    },
    size: DEFAULT_COLUMN_WIDTH,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      const SortIcon = getSortIcon(column)
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
          class: 'hover:bg-muted',
        },
        () => [
          'Last Updated',
          h(SortIcon, {
            class: `mx-3 ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-blue-600' : 'text-muted-foreground'}`,
          }),
        ],
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as Date
      return h('div', { class: 'mx-3 text-muted-foreground' }, date.toLocaleDateString())
    },
    size: DEFAULT_COLUMN_WIDTH,
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-center mx-3' }, 'Actions'),
    cell: ({ row }) => {
      const patient = row.original
      return h('div', { class: 'flex items-center justify-center gap-2 mx-3 my-2' }, [
        h(
          RouterLink,
          {
            to: `/patients/${patient.id}`,
          },
          () =>
            h(
              Button,
              {
                variant: 'ghost',
                size: 'sm',
                class: 'h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 cursor-pointer',
              },
              () => h(Eye, { class: 'h-4 w-4' }),
            ),
        ),
        h(
          Button,
          {
            variant: 'ghost',
            size: 'sm',
            class: 'h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 cursor-pointer',
            onClick: () => {
              console.log('Delete patient:', patient.id)
            },
          },
          () => h(Trash2, { class: 'h-4 w-4' }),
        ),
      ])
    },
    enableSorting: false,
    maxSize: 50,
    size: 50,
  },
]
