/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { JSX, useState, useEffect } from "react";
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  getPaginationRowModel,
  useReactTable 
} from "@tanstack/react-table";
import CreateAdminModal from "@/components/ui/admin-modal";
import { authService } from "@/lib/api"; // Import the auth service
import { useAuthStore } from "@/store/useAuthStore";

// Define User interface
interface User {
  id: number;
  username: string;
  email?: string; // Making email optional as it might not be in your schema
  user_plan: string;
  is_admin: boolean;
}

// Column definitions
const columnHelper = createColumnHelper<User>();
const columns = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("username", {
    header: () => "Username",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("user_plan", {
    header: () => "Plan",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("is_admin", {
    header: () => "Admin Status",
    cell: (info) => info.getValue() ? "Admin" : "Regular User",
  }),
];

const Profile: React.FC = (): JSX.Element => {
  const [data, setData] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const users = await authService.getAllUsers();
        setData(users);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. You may not have admin privileges.");
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const table = useReactTable({
    data,
    columns,
    // Add pagination
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 5, // Set default page size
        pageIndex: 0,
      },
    },
  });

  // Handle user creation completion
  const handleUserCreated = async () => {
    setIsModalOpen(false);
    // Refresh the user list
    try {
      const users = await authService.getAllUsers();
      setData(users);
    } catch (err) {
      console.error("Failed to refresh users:", err);
    }
  };

  // Check if user is admin
  const isAdmin = user?.is_admin || false;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto"> {/* Made container wider */}
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        
        {isAdmin ? (
          <>
            <p className="text-gray-600 mb-4">Admin view - Manage all users</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create New User
            </button>
          </>
        ) : (
          <p className="text-gray-600 mb-4">You don't have admin privileges to view all users</p>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : isAdmin && data.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)}
                    </span>{" "}
                    of <span className="font-medium">{data.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </span>
                    
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        ) : isAdmin ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>No users found in the system.</p>
          </div>
        ) : null}

        {isAdmin && (
          <CreateAdminModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onUserCreated={handleUserCreated}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;