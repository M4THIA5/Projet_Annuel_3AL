"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2 } from "lucide-react"

import { Button } from "#/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu"
import { Input } from "#/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table"
import { useCallback, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import { UserProfile, UserRole, userRole } from "#/types/user"
import { deleteUserById, getAllUsers } from "#/lib/api_requests/user"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Details } from "./details"

function DeleteUserDialog({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-600 focus:bg-red-50 focus:text-red-700"
          onSelect={e => e.preventDefault()}
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
          Supprimer
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;utilisateur?</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setOpen(false)
              onConfirm()
            }}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getAllColumns(
  deleteUser: (id: number) => void,
  setUserDetails: (id: number) => void
): ColumnDef<UserProfile>[] {
  return [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Avatar>
          <AvatarImage src={row.getValue("image")} alt="Profile Image" />
            <AvatarFallback>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </AvatarFallback>
        </Avatar>
    ),
  }, {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  }, {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prénom
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("firstName")}</div>,
  }, {
    accessorKey: "lastName",
    enableSorting: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("lastName")}</div>,
  }, {
    accessorKey: "roles",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Roles
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {(Array.isArray(row.getValue("roles")) && (row.getValue("roles") as UserRole[]).includes(userRole.admin))
          ? <span className="text-red-600">Admin</span>
          : <span className="text-blue-600">Classic</span>
        }
      </div>
    ),
  }, {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setUserDetails(row.original.id)}>Voir le détail</DropdownMenuItem>
          <DeleteUserDialog onConfirm={() => deleteUser(row.original.id)} />
        </DropdownMenuContent>
      </DropdownMenu>
    )
    },
  },]
}

export default function DashboardAdminPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [users, setUsers] = useState<UserProfile[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [userDetails, setUserDetails] = useState<number | null>(null)

  async function deleteUser(userId: number) {
  const response = await deleteUserById(userId)
    if (response.ok) {
      toast.success("Utilisateur supprimé avec succès!")
      await fetchUsers()
      return
    }
    toast.error("Échec de la suppression de l'utilisateur.")
  }

  const fetchUsers = useCallback(async () => {
      const data = await getAllUsers({ page })

      setUsers(data.users)
      setTotalPages(data.totalPages)
      setPage(data.page)
      setPageSize(data.pageSize)
    }, [page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const table = useReactTable({
    data: users,
    columns: getAllColumns(deleteUser, setUserDetails),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
      sorting,
      columnFilters,
      columnVisibility,
    },
    pageCount: totalPages,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater
      setPage(newState.pageIndex + 1)
      setPageSize(newState.pageSize)
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colonnes <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center"
                >
                  Pas de résultats.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">

        <span className="text-sm text-muted-foreground">
          Page {page} / {totalPages}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
      {userDetails && (
        <Details userId={userDetails} setUserDetails={setUserDetails} />
      )}
    </div>
  )
}
