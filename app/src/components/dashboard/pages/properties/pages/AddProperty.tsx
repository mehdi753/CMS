import { useNavigate } from "react-router-dom";
import { addProperty } from "../../../../../store/slices/propertiesSlice";
import { Button } from "flowbite-react";
import useForm, { VALIDATORS } from "../../../../../hooks/useForm";
import { Input } from "../../../../misc/inputs/Input";
import { useState } from "react";

export function AddProperty() {
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { fields, handleChange, isValid } = useForm<
    "name" | "longitude" | "latitude" | "websiteName" | "websiteUrl"
  >({
    name: {
      value: "",
      validators: [VALIDATORS.REQUIRED],
    },
    longitude: {
      value: "",
      validators: [VALIDATORS.REQUIRED],
    },
    latitude: {
      value: "",
      validators: [VALIDATORS.REQUIRED],
    },
    websiteName: {
      value: "",
      validators: [VALIDATORS.REQUIRED],
    },
    websiteUrl: {
      value: "",
      validators: [VALIDATORS.REQUIRED, VALIDATORS.URL],
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveLoading(true);
    const formData = new FormData(event.currentTarget);
    const active = formData.get("active");
    const name = formData.get("name") as string;
    const longitude = formData.get("longitude") as string;
    const latitude = formData.get("latitude") as string;
    const websiteName = formData.get("websiteName") as string;
    const websiteUrl = formData.get("websiteUrl") as string;

    if (isValid) {
      addProperty(
        {
          active: Boolean(active),
          name,
          location: {
            longitude: Number(longitude),
            latitude: Number(latitude),
          },
          websiteName,
          websiteUrl,
        },
        () => {
          navigate("..");
          setSaveLoading(false);
        },
        () => {
          setSaveLoading(false);
        }
      );
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} onChange={handleChange}>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-12 flex items-center sm:col-span-6">
              <div className="px-2 text-gray-500 font-semibold">
                Property Info
              </div>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <label className="relative inline-flex items-center mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  value={"checked"}
                  className="sr-only peer"
                  name="active"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Status
                </span>
              </label>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Property name
              </label>
              <Input
                state={fields.name?.state}
                errorMessage={fields.name?.errorMessage}
                type="text"
                name="name"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="longitude"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Longitude
              </label>
              <Input
                state={fields.longitude?.state}
                errorMessage={fields.longitude?.errorMessage}
                type="text"
                name="longitude"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="latitude"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Latitude
              </label>
              <Input
                state={fields.latitude?.state}
                errorMessage={fields.latitude?.errorMessage}
                type="text"
                name="latitude"
              />
            </div>
            <div className="col-span-12 flex items-center sm:col-span-6">
              <div className="px-2 text-gray-500 font-semibold">
                Website Info
              </div>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="websiteName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Website name
              </label>
              <Input
                state={fields.websiteName?.state}
                errorMessage={fields.websiteName?.errorMessage}
                type="text"
                name="websiteName"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="websiteUrl"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Website URL
              </label>
              <Input
                state={fields.websiteUrl?.state}
                errorMessage={fields.websiteUrl?.errorMessage}
                type="text"
                name="websiteUrl"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center p-6 space-x-2 rounded-b-600">
          <Button
            type="submit"
            disabled={saveLoading}
            isProcessing={saveLoading}
            className="disabled:opacity-75 text-white enabled:bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-blue-700 disabled:hover:bg-blue-800 disabled:focus:ring-4 disabled:focus:outline-none disabled:focus:ring-blue-300"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

AddProperty.displayName = "AddProperty";
