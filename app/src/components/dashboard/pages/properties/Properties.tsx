/* eslint-disable react-hooks/exhaustive-deps */
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { EditModal } from "./misc/EditModal";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getProperties,
  deleteProperty as deletePropertyAction,
} from "../../../../store/slices/propertiesSlice";
import { classNames } from "../../../../utils/helpers";
import { useDebounce } from "../../../../hooks/useDebounce";
import { PropertyQueryFilters } from "../../../../@types/filters";
import { Property } from "../../../../@types/property";
import { Button, Spinner } from "flowbite-react";
import { PopConfirmModal } from "../../../misc/PopConfirmModal";
import { AssigneesModal } from "./misc/AssigneesModal";
import { useAuth } from "../../../../hooks/useAuth";
import { ROLE } from "../../../../@types/role";

export enum Action {
  EDIT = "edit",
  ASSIGNEE = "assignee",
  DELETE = "delete",
}
export function Properties() {
  const limit = 10;
  const { authorize } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(1);
  const [errored, setErrored] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const debouncedName = useDebounce<string>(name, 300);
  const [displayToast, setDisplayToast] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [action, setAction] = useState<Action | null>(null);

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

  const loadProperties = useCallback(() => {
    setLoading(true);
    setErrored(false);
    const query: Partial<PropertyQueryFilters> = {};
    if (debouncedName) {
      query.name = debouncedName;
    }

    getProperties(
      { limit, offset, query },
      (data) => {
        setProperties(data.list);
        setTotal(data.total);
        setLoading(false);
        setErrored(false);
      },
      (data) => {
        setProperties(data.list);
        setTotal(data.total);
        setLoading(false);
        setErrored(true);
      }
    );
  }, [offset, debouncedName]);

  useEffect(loadProperties, [loadProperties]);

  useEffect(() => {
    if (!selectedProperty) {
      setAction(null);
    }
  }, [selectedProperty]);

  const deleteProperty = (id: string) => {
    deletePropertyAction(id, () => {
      setSelectedProperty(null);
      loadProperties();
    });
  };

  const handleAction = (property: Property, action: Action) => {
    setSelectedProperty(property);
    setAction(action);
  };

  useEffect(() => {
    if (displayToast) {
      setTimeout(() => {
        setDisplayToast(false);
      }, 5000);
    }
  }, [displayToast]);

  return (
    <div>
      {displayToast ? (
        <div
          id="toast-sucess"
          className="mt-10 absolute top-6 right-6 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
            <CheckIcon className="w-5 h-5" />

            <span className="sr-only">Success icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">
            Operation executed successfully
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
            data-dismiss-target="#toast-sucess"
            aria-label="Close"
            onClick={() => setDisplayToast(false)}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <></>
      )}
      <h1 className="mb-10">Manage properties</h1>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <div className="flex items-center justify-between pb-4">
          {isAuthorizedSuperAdmin ? (
            <Link to="add">
              <button className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-1">
                <PlusCircleIcon className="w-6 h-6 mr-1 text-white" />
                Add property
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
              id="table-search-properties"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for properties"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left shadow-md text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-t">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Status
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
              properties?.map((property, index) => (
                <tr
                  className="bg-white border-b-700 hover:bg-gray-50"
                  key={index}
                >
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                  >
                    <div className="pl-3">
                      <div className="text-base font-semibold">
                        {property.name}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {property.active ? (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          Active
                        </>
                      ) : (
                        <>
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                          Inactive
                        </>
                      )}
                    </div>
                  </td>
                  {isAuthorizedAdmin ? (
                    <td className="px-6 py-4">
                      <button
                        className="font-medium text-indigo-600 hover:underline mr-5"
                        onClick={() => handleAction(property, Action.ASSIGNEE)}
                      >
                        <UsersIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="font-medium text-blue-600 hover:underline mr-5"
                        onClick={() => handleAction(property, Action.EDIT)}
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      {isAuthorizedSuperAdmin ? (
                        <button
                          className="font-medium text-red-600 hover:underline"
                          onClick={() => handleAction(property, Action.DELETE)}
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
            <span className="font-medium">
              Unable to load list of properties
            </span>
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
      {selectedProperty ? (
        action === Action.ASSIGNEE ? (
          <AssigneesModal
            property={selectedProperty}
            setProperty={setSelectedProperty}
          />
        ) : action === Action.EDIT ? (
          <EditModal
            property={selectedProperty}
            setProperty={setSelectedProperty}
            loadProperties={loadProperties}
            setDisplayToast={setDisplayToast}
          />
        ) : action === Action.DELETE ? (
          <PopConfirmModal
            isOpen={selectedProperty}
            setIsOpen={setSelectedProperty}
            message="Do you wish to delete this property"
            buttons={[
              <Button
                key={1}
                color="failure"
                onClick={() => deleteProperty(selectedProperty._id!)}
              >
                Yes
              </Button>,
              <Button
                key={2}
                color="gray"
                onClick={() => setSelectedProperty(null)}
              >
                No
              </Button>,
            ]}
          />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
}

Properties.displayName = "Properties";
