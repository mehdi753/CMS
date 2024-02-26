/* eslint-disable react-hooks/exhaustive-deps */
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../../../../hooks/useDebounce";
import {
  getUsers,
  deleteUser as deleteUserAction,
} from "../../../../store/slices/usersSlice";
import { classNames } from "../../../../utils/helpers";
import { EditModal } from "./misc/EditModal";
import { UserQueryFilters } from "../../../../@types/filters";
import { ROLE, ROLE_NAME } from "../../../../@types/role";
import { User } from "../../../../@types/user";
import { Button, Spinner } from "flowbite-react";
import { PopConfirmModal } from "../../../misc/PopConfirmModal";
import { useAuth } from "../../../../hooks/useAuth";

export function Users() {
  const limit = 10;
  const { authorize } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(1);
  const [errored, setErrored] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce<string>(search, 300);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deletedUser, setDeletedUser] = useState<User | null>(null);

  const isAuthorizedSuperAdmin = useMemo(
    () =>
      authorize(
        [ROLE.SUPER_ADMIN],
        () => true,
        () => false
      ),
    [authorize]
  );
  const isAuthorizedAdmin = useMemo(
    () =>
      authorize(
        [ROLE.SUPER_ADMIN, ROLE.ADMIN],
        () => true,
        () => false
      ),
    [authorize]
  );

  const loadUsers = useCallback(() => {
    setLoading(true);
    setErrored(false);
    const query: Partial<UserQueryFilters> = {};
    if (debouncedSearch) {
      query.search = debouncedSearch;
    }

    getUsers(
      { limit, offset, query },
      (data) => {
        setUsers(data.list);
        setTotal(data.total);
        setLoading(false);
        setErrored(false);
      },
      (data) => {
        setUsers(data.list);
        setTotal(data.total);
        setLoading(false);
        setErrored(true);
      }
    );
  }, [offset, debouncedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const deleteUser = (email: string) => {
    deleteUserAction(email, () => {
      setDeletedUser(null);
      loadUsers();
    });
  };

  return (
    <div>
      <h1 className="mb-10">Manage users</h1>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <div className="flex items-center justify-between pb-4">
          {isAuthorizedSuperAdmin ? (
            <Link to="add">
              <button className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-1">
                <PlusCircleIcon className="w-6 h-6 mr-1 text-white" />
                Add user
              </button>
            </Link>
          ) : (
            <></>
          )}

          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for users"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left shadow-md text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-t">
            <tr>
              <th scope="col" className="px-6 py-3">
                Full name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Verified
              </th>
              {isAuthorizedAdmin ? (
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              ) : (
                <></>
              )}
            </tr>
          </thead>
          <tbody>
            {(!loading &&
              !errored &&
              users.map((user, index) => (
                <tr
                  className="bg-white border-b-700 hover:bg-gray-50"
                  key={index}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                  >
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user.picture || ""}
                      alt={`${user.firstName} ${user.lastName}`}
                    ></img>
                    <div className="pl-3">
                      <div className="text-base font-semibold">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{ROLE_NAME[user.role]}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {user.verified ? (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          Verified
                        </>
                      ) : (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                          Not verified
                        </>
                      )}
                    </div>
                  </td>
                  {isAuthorizedAdmin ? (
                    <td className="px-6 py-4">
                      <button
                        className="font-medium text-blue-600 hover:underline mr-5"
                        onClick={() => setSelectedUser(user)}
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      {isAuthorizedSuperAdmin ? (
                        <button
                          className="font-medium text-red-600 hover:underline"
                          onClick={() => setDeletedUser(user)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                  ) : (
                    <></>
                  )}
                </tr>
              ))) || <></>}
          </tbody>
        </table>
        {loading ? (
          <div className="w-full flex justify-center h-20 pt-2">
            <div role="status">
              <Spinner aria-label="Loading..." color="purple" />
            </div>
          </div>
        ) : errored ? (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 flex justify-center"
            role="alert"
          >
            <span className="font-medium">Unable to load list of users</span>
          </div>
        ) : (
          <></>
        )}
      </div>
      <nav
        className="flex items-center justify-end pt-4"
        aria-label="Table navigation"
      >
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setOffset(offset - 1)}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          </li>
          {Array.from({ length: total }, (_, i) => i + 1).map((v, i) => (
            <li key={i}>
              <button
                onClick={() => setOffset(v)}
                aria-current={i === offset ? "page" : "false"}
                className={classNames(
                  "px-3 py-2 leading-tight",
                  v === offset
                    ? "text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                )}
              >
                {v}
              </button>
            </li>
          ))}
          <li>
            <button
              className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
              onClick={() => setOffset(offset + 1)}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </li>
        </ul>
      </nav>
      {(selectedUser && (
        <EditModal
          user={selectedUser}
          setUser={setSelectedUser}
          loadUsers={loadUsers}
        />
      )) || <></>}
      {(deletedUser && (
        <PopConfirmModal
          isOpen={deletedUser}
          setIsOpen={setDeletedUser}
          message="Do you wish to delete this user"
          buttons={[
            <Button
              key={1}
              color="failure"
              onClick={() => deleteUser(deletedUser.email)}
            >
              Yes
            </Button>,
            <Button key={2} color="gray" onClick={() => setDeletedUser(null)}>
              No
            </Button>,
          ]}
        />
      )) || <></>}
    </div>
  );
}

Users.displayName = "Users";
