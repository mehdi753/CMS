/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { addUser } from "../../../../../store/slices/usersSlice";
import { ROLE, ROLE_NAME } from "../../../../../@types/role";
import { useCallback, useEffect, useState } from "react";
import { getProperties } from "../../../../../store/slices/propertiesSlice";
import { PropertyQueryFilters } from "../../../../../@types/filters";
import { Button } from "flowbite-react";
import useForm, { VALIDATORS } from "../../../../../hooks/useForm";
import { Input } from "../../../../misc/inputs/Input";
import { Select } from "../../../../misc/inputs/Select";
import { Property } from "../../../../../@types/property";

export function AddUser() {
  const limit = 10;
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { fields, handleChange, isValid } = useForm<
    | "email"
    | "firstName"
    | "lastName"
    | "role"
    | "password"
    | "cPassword"
    | "property"
  >({
    email: {
      value: "",
      validators: [VALIDATORS.REQUIRED, VALIDATORS.EMAIL],
    },
    firstName: {
      value: "",
      validators: [VALIDATORS.REQUIRED],
    },
    lastName: {
      value: "",
      validators: [VALIDATORS.REQUIRED],
    },
    role: {
      value: ROLE.AGENT,
      validators: [VALIDATORS.REQUIRED, VALIDATORS.ENUM],
      enum: Object.values(ROLE),
    },
    property: {
      value: "",
    },
  });

  const roles = [
    { value: ROLE.SUPER_ADMIN, name: ROLE_NAME[ROLE.SUPER_ADMIN] },
    { value: ROLE.ADMIN, name: ROLE_NAME[ROLE.ADMIN] },
    { value: ROLE.AGENT, name: ROLE_NAME[ROLE.AGENT] },
  ];

  const loadProperties = useCallback(() => {
    setLoading(true);
    const query: Partial<PropertyQueryFilters> = {};

    getProperties(
      { limit, offset: 1, query },
      (data) => {
        setProperties(data.list);
        setLoading(false);
      },
      (data) => {
        setProperties(data.list);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const role = formData.get("role") as unknown as ROLE;

    if (isValid) {
      addUser(
        {
          email,
          firstName,
          lastName,
          role,
        },
        () => {
          navigate("..");
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
              <div className="px-2 text-gray-500 font-semibold">User Info</div>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <Input
                state={fields.email?.state}
                errorMessage={fields.email?.errorMessage}
                type="text"
                name="email"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="firstName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                First name
              </label>
              <Input
                state={fields.firstName?.state}
                errorMessage={fields.firstName?.errorMessage}
                type="text"
                name="firstName"
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="lastName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Last name
              </label>
              <Input
                state={fields.lastName?.state}
                errorMessage={fields.lastName?.errorMessage}
                type="text"
                name="lastName"
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Role
              </label>
              <Select
                state={fields.role?.state}
                errorMessage={fields.role?.errorMessage}
                id="role"
                name="role"
                defaultValue={ROLE.AGENT}
                options={roles}
              />
            </div>
            <div className="col-span-12 flex items-center sm:col-span-6">
              <div className="px-2 text-gray-500 font-semibold">
                Property subscription
              </div>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="property"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Property
              </label>
              <Select
                state={fields.property?.state}
                errorMessage={fields.property?.errorMessage}
                id="property"
                name="property"
                options={properties.map((p) => ({
                  name: p.name,
                  value: p._id!,
                }))}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center p-6 space-x-2 rounded-b-600">
          <Button
            type="submit"
            disabled={!isValid || loading || saveLoading}
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

AddUser.displayName = "AddUser";
