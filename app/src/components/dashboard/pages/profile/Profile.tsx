import { Button } from "flowbite-react";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { ROLE, ROLE_NAME } from "../../../../@types/role";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import {
  ArrowUpCircleIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useState } from "react";
import { upload } from "../../../../utils/helpers";
import { AddOrUpdateUser } from "../../../../@types/user";
import useForm, { VALIDATORS } from "../../../../hooks/useForm";
import { editProfile } from "../../../../store/slices/authSlice";
import { Input } from "../../../misc/inputs/Input";
import { Select } from "../../../misc/inputs/Select";

export function Profile() {
  const { user, loading } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const [picture, setPicture] = useState<File | null>(null);
  const [displayToast, setDisplayToast] = useState<boolean>(false);

  const [picturePreview, setPicturePreview] = useState<
    string | ArrayBuffer | undefined | null
  >(user.picture);

  const reader = new FileReader();

  const roles = [
    { value: ROLE.SUPER_ADMIN, name: ROLE_NAME[ROLE.SUPER_ADMIN] },
    { value: ROLE.ADMIN, name: ROLE_NAME[ROLE.ADMIN] },
    { value: ROLE.AGENT, name: ROLE_NAME[ROLE.AGENT] },
  ];

  const validators = {
    password: (
      value: string,
      cPassword: string
    ): { state: boolean; errorMessage?: string } => {
      if (cPassword) {
        if (!value) {
          return { state: false, errorMessage: "This field is required" };
        } else if (value !== cPassword) {
          return { state: false, errorMessage: "Password doesn't match" };
        }
      }
      return {
        state: true,
      };
    },
    cPassword: (
      value: string,
      password: string
    ): { state: boolean; errorMessage?: string } => {
      if (password) {
        if (!value) {
          return { state: false, errorMessage: "This field is required" };
        } else if (value !== password) {
          return {
            state: false,
            errorMessage: "Confirm password doesn't match",
          };
        }
      }
      return {
        state: true,
      };
    },
  };

  const { fields, handleChange, isValid } = useForm<
    "firstName" | "lastName" | "role" | "password" | "cPassword"
  >({
    firstName: {
      value: user.firstName,
      validators: [VALIDATORS.REQUIRED],
    },
    lastName: {
      value: user.lastName,
      validators: [VALIDATORS.REQUIRED],
    },
    role: {
      value: user.role,
      validators: [VALIDATORS.REQUIRED, VALIDATORS.ENUM],
      enum: Object.values(ROLE),
    },
    password: {
      value: "",
      validator: validators.password,
      dependencies: ["cPassword"],
    },
    cPassword: {
      value: "",
      validator: validators.cPassword,
      dependencies: ["password"],
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPicture(e.target.files[0]);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const role = formData.get("role") as unknown as ROLE;
      const password = formData.get("password") as string;
      const cPassword = formData.get("cPassword") as string;
      let newPicture = null;
      if (picture) {
        newPicture = await upload(picture);
      }
      if (user.email && firstName && lastName && role) {
        const editedUser: AddOrUpdateUser = {
          email: user.email,
          firstName,
          lastName,
          role,
        };
        if (newPicture) {
          editedUser.picture = newPicture;
        }
        if (password && cPassword && password === cPassword) {
          editedUser.password = password;
        }
        dispatch(
          editProfile(editedUser, () => {
            setDisplayToast(true);
          })
        );
      }
    }
  };

  if (reader) {
    reader.onloadend = () => {
      setPicturePreview(reader.result);
    };
  }

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
      <form onSubmit={handleSubmit} onChange={handleChange}>
        <div className="space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="sm:col-span-3 col-span-12">
              <div className="flex items-center justify-start w-full">
                <label
                  htmlFor="dropzone-file"
                  className="group rounded-full flex flex-col items-center justify-center w-64 h-64 border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100"
                  style={
                    picturePreview
                      ? {
                          backgroundImage: `url(${picturePreview})`,
                          backgroundRepeat: "round",
                        }
                      : {}
                  }
                >
                  <div className="hidden rounded-full group-hover:flex group-hover:flex-col group-hover:items-center group-hover:justify-center hover:bg-gray-100 opacity-70 w-full h-full pt-5 pb-6">
                    <ArrowUpCircleIcon className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span>
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            <div className="sm:col-span-9 col-span-12 grid grid-cols-12 gap-6">
              <div className="col-span-12 flex items-center sm:col-span-6">
                <div className="px-2 text-gray-500 font-semibold">
                  User Info
                </div>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>
              <div className="col-span-12">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="cursor-not-allowed shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  defaultValue={user.email}
                  disabled
                />
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  First name
                </label>
                <Input
                  state={fields.firstName?.state}
                  errorMessage={fields.firstName?.errorMessage}
                  type="text"
                  name="firstName"
                  defaultValue={user.firstName}
                />
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Last name
                </label>
                <Input
                  state={fields.lastName?.state}
                  errorMessage={fields.lastName?.errorMessage}
                  type="text"
                  name="lastName"
                  defaultValue={user.lastName}
                />
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  User role
                </label>
                <Select
                  state={fields.role?.state}
                  errorMessage={fields.role?.errorMessage}
                  id="role"
                  name="role"
                  defaultValue={user.role}
                  options={roles}
                />
              </div>
              <div className="col-span-12 flex items-center">
                <div className="px-2 text-gray-500 font-semibold">Password</div>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  New password
                </label>
                <Input
                  state={fields.password?.state}
                  errorMessage={fields.password?.errorMessage}
                  type="password"
                  name="password"
                />
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="cPassword"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Confirm password
                </label>
                <Input
                  state={fields.cPassword?.state}
                  errorMessage={fields.cPassword?.errorMessage}
                  type="password"
                  name="cPassword"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end p-6 space-x-2 rounded-b-600">
          <Button
            type="submit"
            disabled={!isValid || loading}
            isProcessing={loading}
            className="disabled:opacity-75 text-white enabled:bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:bg-blue-700 disabled:hover:bg-blue-800 disabled:focus:ring-4 disabled:focus:outline-none disabled:focus:ring-blue-300"
          >
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
Profile.displayName = "Profile";
