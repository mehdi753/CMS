/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Property } from "../../../../../@types/property";
import { Button, Modal, Spinner } from "flowbite-react";
import { classNames } from "../../../../../utils/helpers";
import { useCallback, useEffect, useState } from "react";
import { UserQueryFilters } from "../../../../../@types/filters";
import { getUsers, searchUsers } from "../../../../../store/slices/usersSlice";
import { assignUser } from "../../../../../store/slices/propertiesSlice";
import { Search } from "../../../../misc/inputs/Search";
import { User } from "../../../../../@types/user";

interface Props {
  property: Property;
  setProperty: (v: Property | null) => void;
}

export function AssigneesModal({ property, setProperty }: Props) {
  const limit = 10;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(1);
  const [errored, setErrored] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const loadUsers = useCallback(() => {
    setLoading(true);
    setErrored(false);
    const query: Partial<UserQueryFilters> = {
      properties: [property._id!],
    };

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
  }, [offset]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const assign = (subscribe: boolean, email: string) => {
    assignUser({ subscribe, email, propertyId: property._id! }, () => {
      loadUsers();
    });
  };

  const handleSearch = async (text: string) => {
    const { list } = await searchUsers({
      limit: 10,
      offset: 1,
      query: { search: text, $not: { properties: [property._id!] } },
    });

    if (list.length) {
      return list.map((user) => ({
        name: `${user.firstName} ${user.lastName}`,
        value: user,
      }));
    }
    return [];
  };

  const handleSelectUser = (user: User) => {
    assign(true, user.email);
  };

  return (
    <Modal show={!!property} onClose={() => setProperty(null)}>
      <Modal.Header>Assignees</Modal.Header>
      <Modal.Body>
        <div className="flex items-center justify-between pb-4">
          <label htmlFor="table-search" className="sr-only">
            Assign user
          </label>
          <Search
            type="text"
            id="table-search-users"
            className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for users"
            action={handleSearch}
            handleClick={handleSelectUser}
          />
        </div>
        <table className="w-full text-sm text-left shadow-md text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-t">
            <tr>
              <th scope="col" className="px-3 py-1.5">
                Full name
              </th>
              <th scope="col" className="px-3 py-1.5">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {(!loading &&
              !errored &&
              users.length &&
              users.map((user, index) => (
                <tr
                  className="bg-white border-b-700 hover:bg-gray-50"
                  key={index}
                >
                  <th
                    scope="row"
                    className="flex items-center px-3 py-2 text-gray-900 whitespace-nowrap"
                  >
                    <img
                      className="w-7 h-7 rounded-full"
                      src={user.picture || ""}
                      alt={`${user.firstName} ${user.lastName}`}
                    ></img>
                    <div className="pl-3">
                      <div className="text-base font-semibold">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </th>
                  <td className="px-3 py-2">
                    <button
                      className="font-medium text-red-600 hover:underline"
                      onClick={() => assign(false, user.email)}
                    >
                      <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    </button>
                  </td>
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
        ) : !users.length ? (
          <div
            className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50"
            role="alert"
          >
            <span className="font-medium">
              No user has been assigned to this property
            </span>
          </div>
        ) : (
          <></>
        )}
        {total > limit ? (
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
        ) : (
          <></>
        )}
      </Modal.Body>
      <Modal.Footer className="flex items-center justify-end">
        <Button color={"light"} onClick={() => setProperty(null)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
