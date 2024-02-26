/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from "react";
import { FEATURE, Feature } from "../../../../../@types/feature";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { classNames, upload } from "../../../../../utils/helpers";
import { ArrowUpCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  feature: Feature<FEATURE.GALLERY>;
  editFeature: (f: Feature) => void;
}
export function Gallery({ feature, editFeature }: Props) {
  const { editMode } = useAppSelector((state) => state.websites);
  const [pictures, setPictures] = useState<string[]>(feature.images || []);

  const handleChangeImages = (images: string[]) => {
    editFeature({
      ...feature,
      images,
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const url = await upload(files[0]);
      if (url) {
        setPictures([...pictures, url]);
      }
    }
  };

  const removeImage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    const newFileList = pictures.filter((_p, i) => i !== index);
    setPictures(newFileList);
  };

  useEffect(() => {
    if (pictures) {
      handleChangeImages(pictures);
    }
  }, [pictures]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <div
          className={classNames(
            "flex items-center justify-center w-full mb-5",
            !editMode ? "cursor-not-allowed" : ""
          )}
        >
          <label
            htmlFor="dropzone-file"
            className={classNames(
              "flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
              !editMode ? "cursor-not-allowed" : ""
            )}
          >
            <div
              className={classNames(
                "flex flex-col items-center justify-center pt-5 pb-6",
                !editMode ? "cursor-not-allowed" : ""
              )}
            >
              <ArrowUpCircleIcon className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className={classNames(
                "hidden",
                !editMode ? "cursor-not-allowed" : ""
              )}
              onChange={handleFileChange}
              disabled={!editMode}
            />
          </label>
        </div>
        {pictures.map((picture, index) => (
          <div
            key={index}
            className="w-full border mb-5 flex justify-between bg-white"
          >
            <div
              style={{
                backgroundImage: `url(${picture})`,
                height: "50px",
                width: "50px",
                margin: "5px",
              }}
            />
            <button
              className="font-medium text-red-600 hover:underline"
              onClick={(e) => removeImage(e, index)}
            >
              <TrashIcon className="mr-5 w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
