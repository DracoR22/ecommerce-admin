"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./CellAction"

export type CategoryCollumn = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string 
}

export const columns: ColumnDef<CategoryCollumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({row}) => row.original.billboardLabel
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original}/>
  }
]
