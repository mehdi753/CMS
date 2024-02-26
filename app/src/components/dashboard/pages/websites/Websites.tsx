/* eslint-disable react-hooks/exhaustive-deps */
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "../../../../hooks/useDebounce";
import { classNames } from "../../../../utils/helpers";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import {
  getWebsites,
  setWebsiteAction,
} from "../../../../store/slices/websitesSlice";
import { WebsiteQueryFilters } from "../../../../@types/filters";
import { useNavigate } from "react-router-dom";
import { Website } from "../../../../@types/website";
import { Property } from "../../../../@types/property";

export function Websites() {
  const limit = 10;
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(1);
  const [errored, setErrored] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const debouncedName = useDebounce<string>(name, 300);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loadWebsites = useCallback(() => {
    setLoading(true);
    setErrored(false);
    const query: Partial<WebsiteQueryFilters> = {};
    if (debouncedName) {
      query.search = debouncedName;
    }
    getWebsites(
      { limit, offset, query },
      (data) => {
        setWebsites(data.list);
        setTotal(data.total);
        setLoading(false);
        setErrored(false);
      },
      (data) => {
        setWebsites(data.list);
        setTotal(data.total);
        setLoading(false);
        setErrored(true);
      }
    );
  }, [offset, debouncedName]);

  useEffect(() => {
    loadWebsites();
  }, [loadWebsites]);

  const setWebsite = (website: Website) =>
    dispatch(
      setWebsiteAction(website, () => {
        navigate(`${website._id}`);
      })
    );

  return (
    <div>
      <h1 className="mb-10">Manage websites</h1>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <div className="flex items-center justify-end pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="table-search-websites"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for websites"
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
                Property
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {(!loading &&
              !errored &&
              websites?.map((website, index) => (
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
                        <a href={website.url} target="_blank" rel="noreferrer">
                          {website.name}
                        </a>
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    {(website.property as Property).name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {(website.property as Property).active ? (
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
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="flex text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2-600"
                      onClick={() => setWebsite(website)}
                    >
                      <EyeIcon className="w-5 h-5" />{" "}
                      <span className="ml-1">View</span>
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
            <span className="font-medium">Unable to load list of websites</span>
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
    </div>
  );
}

Websites.displayName = "Websites";
