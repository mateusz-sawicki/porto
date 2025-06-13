import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'
import type { Patient } from '@/types/patient/patient'

// Helper function to get the correct sort icon
function getSortIcon(column: any) {
  const sortDirection = column.getIsSorted()
  if (sortDirection === 'asc') return ArrowUp
  if (sortDirection === 'desc') return ArrowDown
  return ArrowUpDown
}

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
        h('div', { class: 'font-semibold' }, `${patient.name} ${patient.surname}`),
        h('div', { class: 'text-sm text-muted-foreground' }, `ID: ${patient.id.slice(0, 8)}...`),
      ])
    },
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
            ? 'bg-green-100 text-green-800 hover:bg-green-100'
            : 'bg-red-100 text-red-800 hover:bg-red-100',
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
  },
  {
    accessorKey: 'creationDate',
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
      const date = row.getValue('creationDate') as Date
      return h('div', { class: 'text-muted-foreground' }, date.toLocaleDateString())
    },
  },
  {
    accessorKey: 'updateDate',
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
            class: `ml-2 h-4 w-4 ${column.getIsSorted() ? 'text-blue-600' : 'text-muted-foreground'}`,
          }),
        ],
      )
    },
    cell: ({ row }) => {
      const date = row.getValue('updateDate') as Date
      return h('div', { class: 'text-muted-foreground' }, date.toLocaleDateString())
    },
  },
]
