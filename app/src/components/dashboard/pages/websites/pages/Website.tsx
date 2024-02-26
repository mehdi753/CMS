/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getWebsite,
  setEditModeAction,
  setEditedWebsiteAction,
  updateWebsite,
} from "../../../../../store/slices/websitesSlice";
import { Loading } from "../../../../misc/Loading";
import { useDebounce } from "../../../../../hooks/useDebounce";
import {
  Bars3Icon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { Page } from "../../../../../@types/page";
import { useAuth } from "../../../../../hooks/useAuth";
import { ROLE } from "../../../../../@types/role";

export function Website() {
  const { authorize } = useAuth();
  const { website, editMode, loading, editedWebsite } = useAppSelector(
    (state) => state.websites
  );

  const dispatch = useAppDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const debouncedName = useDebounce<string>(name, 300);
  const isAuthorized = useMemo(
    () =>
      authorize(
        [ROLE.SUPER_ADMIN, ROLE.ADMIN],
        () => true,
        () => false
      ),
    [authorize]
  );

  const pages = useMemo<Page[]>(() => {
    if (editedWebsite?.pages?.length) {
      if (debouncedName) {
        let newPages: Page[] = [
          ...(editedWebsite.pages as Page[]).filter((page) =>
            new RegExp(debouncedName, "gi").test((page as Page).name)
          ),
        ];
        return newPages.sort((a, b) => a.index - b.index);
      } else {
        let newPages: Page[] = [...(editedWebsite.pages as Page[])];
        return newPages.sort((a, b) => a.index - b.index);
      }
    } else {
      return [];
    }
  }, [editedWebsite, debouncedName]);

  useEffect(() => {
    if (!website) {
      if (params.id) {
        dispatch(
          getWebsite(
            params.id,
            () => {},
            () => navigate("..")
          )
        );
      } else {
        navigate("..");
      }
    }
  }, []);

  const setEditMode = (mode: boolean) => {
    if (!mode && website) dispatch(setEditedWebsiteAction(website));
    dispatch(setEditModeAction(mode));
  };

  const addPage = () => {
    if (editedWebsite && editMode && isAuthorized) {
      const newPage: Page = {
        name: `Page (${(editedWebsite.pages?.length || 0) + 1})`,
        index: editedWebsite.pages?.length || 0,
        features: [],
      };
      dispatch(
        setEditedWebsiteAction({
          ...editedWebsite,
          pages: editedWebsite.pages
            ? [...editedWebsite.pages, newPage]
            : [newPage],
        })
      );
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    e.preventDefault();
    if (editMode && editedWebsite && isAuthorized) {
      const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      const draggedItem = pages[dragIndex];
      const remainingItems = pages.filter(
        (_item, index) => index !== dragIndex
      );

      const updatedList = [
        ...remainingItems.slice(0, dropIndex),
        draggedItem,
        ...remainingItems.slice(dropIndex),
      ].map((item, index) => ({ ...item, index }));

      dispatch(
        setEditedWebsiteAction({ ...editedWebsite, pages: [...updatedList] })
      );
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLLIElement>,
    index: number
  ) => {
    if (editMode && isAuthorized) {
      e.dataTransfer.setData("text/plain", `${index}`);
    }
  };

  const handleContentChange = (
    e: React.FocusEvent<HTMLSpanElement, Element>,
    index: number
  ) => {
    if (editedWebsite && editMode && isAuthorized) {
      const updatedList = JSON.parse(JSON.stringify([...pages]));
      updatedList[index].name = e.target.innerText;

      dispatch(
        setEditedWebsiteAction({ ...editedWebsite, pages: [...updatedList] })
      );
    }
  };

  const removePage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    if (editedWebsite?.pages?.length) {
      dispatch(
        setEditedWebsiteAction({
          ...editedWebsite,
          pages: editedWebsite.pages
            .filter((_p, i) => index !== i)
            .map((p, index) => ({ ...p, index })),
        })
      );
    }
  };

  const save = () => {
    if (editedWebsite) {
      dispatch(
        updateWebsite(
          editedWebsite,
          () => {},
          () => {}
        )
      );
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <div className="flex justify-between mb-10">
        <h1 className="text-3xl capitalize">{website?.name}</h1>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex text-gray-900 bg-white border border-indigo-300 hover:border-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-4 focus:ring-indigo-200 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2"
          >
            <PencilSquareIcon
              className={"w-6 h-6 text-indigo-600 hover:text-indigo-900"}
            />
            <span className="ml-2 text-base">Edit mode</span>
          </button>
        ) : (
          <div className="flex">
            <button
              onClick={save}
              className="flex text-gray-900 bg-white border border-green-300 hover:border-green-600 hover:bg-green-100 focus:outline-none focus:ring-4 focus:ring-green-200 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2"
            >
              <CheckCircleIcon
                className={"w-6 h-6 text-green-600 hover:text-green-900"}
              />
              <span className="ml-2 text-base">Save</span>
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="text-red-600 hover:text-red-900 bg-white border border-red-300 hover:bg-red-100 hover:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-200 font-medium rounded-full text-sm px-1 py-1 mr-2 mb-2"
            >
              <XMarkIcon className={"w-6 h-6"} />
            </button>
          </div>
        )}
      </div>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <div className="flex items-center justify-between pb-4">
          {editMode && isAuthorized ? (
            <button
              onClick={() => addPage()}
              className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-1"
            >
              <PlusCircleIcon className="w-6 h-6 mr-1 text-white" />
              Add page
            </button>
          ) : (
            <div></div>
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
              id="table-search-pages"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for pages"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg-600">
          {pages?.length ? (
            pages.map((page, index) => (
              <Link to="features" key={index} state={page}>
                <li
                  className="flex justify-between w-full px-4 py-2 border-b border-gray-200 focus:bg-gray-400"
                  draggable={editMode && isAuthorized}
                  onDragStart={(e) => {
                    handleDragStart(e, index);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    handleDrag(e, index);
                  }}
                >
                  <div className="flex">
                    {editMode && isAuthorized ? (
                      <Bars3Icon className="w-5 h-5 mr-3 cursor-grabbing" />
                    ) : (
                      <></>
                    )}
                    <span
                      contentEditable={editMode && isAuthorized}
                      suppressContentEditableWarning
                      onBlur={(e) => handleContentChange(e, index)}
                      onClick={(e) => e.preventDefault()}
                      className="outline-none z-10"
                    >
                      {page.name}
                    </span>
                  </div>
                  {editMode && isAuthorized ? (
                    <button
                      className="font-medium text-red-600 hover:underline"
                      onClick={(e) => removePage(e, index)}
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  ) : (
                    <></>
                  )}
                </li>
              </Link>
            ))
          ) : (
            <></>
          )}
          {!pages.length ? (
            <div
              className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 flex justify-center"
              role="alert"
            >
              <span className="font-medium">No pages</span>
            </div>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </div>
  );
}

Website.displayName = "Website";
