/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setEditModeAction,
  setEditedWebsiteAction,
  updateWebsite,
} from "../../../../../store/slices/websitesSlice";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import {
  PencilSquareIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Loading } from "../../../../misc/Loading";
import { Page } from "../../../../../@types/page";
import Accordion from "../../../../misc/Accordion";
import { FEATURE, FEATURE_NAME, Feature } from "../../../../../@types/feature";
import { useDebounce } from "../../../../../hooks/useDebounce";
import { AddFeatureModal } from "../misc/AddFeatureModal";
import { Content } from "../misc/Content";
import { ROLE } from "../../../../../@types/role";
import { useAuth } from "../../../../../hooks/useAuth";
import { Gallery } from "../misc/Gallery";

export function Features() {
  const { authorize } = useAuth();
  const { website, editMode, loading, editedWebsite } = useAppSelector(
    (state) => state.websites
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState<string>("");
  const debouncedName = useDebounce<string>(name, 300);
  const [page, setPage] = useState<Page | null>(location.state);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAuthorized = useMemo(
    () =>
      authorize(
        [ROLE.SUPER_ADMIN, ROLE.ADMIN],
        () => true,
        () => false
      ),
    [authorize]
  );

  const features = useMemo(() => {
    if (page?.features?.length) {
      if (debouncedName) {
        let newFeatures: Feature[] = [
          ...(page.features as Feature[]).filter((feature) =>
            new RegExp(debouncedName, "gi").test((feature as Feature).name)
          ),
        ];
        return newFeatures.sort((a, b) => a.index - b.index);
      } else {
        let newFeatures = [...(page.features as Feature[])];
        return newFeatures.sort((a, b) => a.index - b.index);
      }
    } else {
      return [];
    }
  }, [page, debouncedName]);

  useEffect(() => {
    if (!location.state) {
      navigate("..");
    }
  }, []);

  const setEditMode = (mode: boolean) => {
    if (!mode && website) dispatch(setEditedWebsiteAction(website));
    dispatch(setEditModeAction(mode));
  };

  const addFeature = () => {
    setIsOpen(true);
  };

  const removeFeature = (feature: Feature) => {
    if (feature && page?.features.length) {
      setPage({
        ...page,
        features: page.features
          .filter((f) => f.index !== feature.index)
          .map((f, index) => ({ ...f, index })),
      });
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

  useEffect(() => {
    if (editedWebsite && page) {
      const pageIndex = (editedWebsite?.pages as Page[])?.findIndex(
        (p) => p.name === page.name
      );
      const pages = [...(editedWebsite.pages as Page[])];
      pages[pageIndex] = page;
      if (pageIndex >= 0) {
        dispatch(setEditedWebsiteAction({ ...editedWebsite, pages }));
      }
    }
  }, [page]);

  const editFeature = (feature: Feature) => {
    if (feature && page?.features.length) {
      setPage({
        ...page,
        features: page.features.map((f) =>
          f.index === feature.index ? feature : f
        ),
      });
    }
  };

  const handleDrag = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    if (editMode && editedWebsite && isAuthorized) {
      const dragIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      const draggedItem = features[dragIndex];
      const remainingItems = features.filter(
        (_item, index) => index !== dragIndex
      );

      const updatedList = [
        ...remainingItems.slice(0, dropIndex),
        draggedItem,
        ...remainingItems.slice(dropIndex),
      ].map((item, index) => ({ ...item, index }));
      if (page) {
        setPage({ ...page, features: [...updatedList] });
      }
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    if (editMode && isAuthorized) {
      e.dataTransfer.setData("text/plain", `${index}`);
    }
  };

  const getFeatures = (): {
    id: Feature;
    title: string;
    children: ReactNode;
    removable: boolean;
    removeAction?: (id: Feature) => void;
    collapsible?: boolean;
  }[] =>
    features.map((feature) => {
      let children = <></>;
      let collapsible = false;
      switch (feature.name) {
        case FEATURE.CONTENT:
          children = <Content feature={feature} editFeature={editFeature} />;
          collapsible = true;
          break;
        case FEATURE.CONTACT:
          children = <h1>Soon...</h1>;
          collapsible = true;
          break;
        case FEATURE.GALLERY:
          children = <Gallery feature={feature} editFeature={editFeature} />;
          collapsible = true;
          break;
        case FEATURE.LOCATION:
          collapsible = false;
          break;
      }
      return {
        id: feature,
        title: FEATURE_NAME[feature.name],
        children,
        removable: !!(editMode && isAuthorized),
        removeAction: editMode && isAuthorized ? removeFeature : undefined,
        collapsible,
      };
    });

  return loading ? (
    <Loading />
  ) : (
    <div>
      <div className="flex justify-between mb-10">
        <h1 className="text-3xl capitalize">{page?.name}</h1>
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
              className="flex text-gray-900 bg-white border border-green-300 hover:border-green-600 hover:bg-green-100 focus:outline-none  focus:ring-4 focus:ring-green-200 font-medium rounded-full text-sm px-3 py-1 mr-2 mb-2"
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
              onClick={() => addFeature()}
              className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-1"
            >
              <PlusCircleIcon className="w-6 h-6 mr-1 text-white" />
              Add Feature
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
              id="table-search-features"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500-600"
              placeholder="Search for features"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="w-full">
        {features?.length ? (
          <Accordion
            list={getFeatures()}
            draggable={editMode && isAuthorized}
            handleDrag={handleDrag}
            handleDragStart={handleDragStart}
          />
        ) : (
          <></>
        )}
      </div>
      {!features.length ? (
        <div
          className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 flex justify-center"
          role="alert"
        >
          <span className="font-medium">No features</span>
        </div>
      ) : (
        <></>
      )}
      {isOpen && page ? (
        <AddFeatureModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          page={page}
          setPage={setPage}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

Features.displayName = "Features";
