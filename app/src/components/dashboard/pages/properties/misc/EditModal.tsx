import { Property } from "../../../../../@types/property";
import { editProperty } from "../../../../../store/slices/propertiesSlice";
import { Button, Modal } from "flowbite-react";
import useForm, { VALIDATORS } from "../../../../../hooks/useForm";
import { Input } from "../../../../misc/inputs/Input";
import { useState } from "react";

interface Props {
  property: Property;
  setProperty: (v: Property | null) => void;
  loadProperties: () => void;
  setDisplayToast: (v: boolean) => void;
}

export function EditModal({
  property,
  setProperty,
  loadProperties,
  setDisplayToast,
}: Props) {
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const { fields, handleChange, isValid } = useForm<
    "name" | "longitude" | "latitude"
  >({
    name: {
      value: property.name,
      validators: [VALIDATORS.REQUIRED],
    },
    longitude: {
      value: property.location.longitude,
      validators: [VALIDATORS.REQUIRED],
    },
    latitude: {
      value: property.location.latitude,
      validators: [VALIDATORS.REQUIRED],
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

    if (isValid && property?._id) {
      editProperty(
        {
          _id: property._id,
          active: Boolean(active),
          name,
          location: {
            longitude: Number(longitude),
            latitude: Number(latitude),
          },
        },
        () => {
          setSaveLoading(false);
          setDisplayToast(true);
          loadProperties();
          setProperty(null);
        },
        () => {
          setSaveLoading(false);
        }
      );
    }
  };

  return (
    <Modal show={!!property} onClose={() => setProperty(null)}>
      <Modal.Header>Edit property</Modal.Header>
      <Modal.Body>
        <form
          id={`EDIT_PROPERTY_${property._id}`}
          onSubmit={handleSubmit}
          onChange={handleChange}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-12 sm:col-span-6">
                <label className="relative inline-flex items-center mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    value={"checked"}
                    className="sr-only peer"
                    name="active"
                    defaultChecked={property.active}
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
                  defaultValue={property.name}
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
                  defaultValue={property.location.longitude}
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
                  defaultValue={property.location.latitude}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="submit"
          disabled={!isValid || saveLoading}
          isProcessing={saveLoading}
          className="disabled:opacity-75 text-white enabled:bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-blue-700 disabled:hover:bg-blue-800 disabled:focus:ring-4 disabled:focus:outline-none disabled:focus:ring-blue-300"
          form={`EDIT_PROPERTY_${property._id}`}
        >
          Save
        </Button>
        <Button
          disabled={saveLoading}
          color={"light"}
          onClick={() => setProperty(null)}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
