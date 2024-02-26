import { User } from "../../../../../@types/user";
import { editUser } from "../../../../../store/slices/usersSlice";
import { ROLE, ROLE_NAME } from "../../../../../@types/role";
import { Button, Modal } from "flowbite-react";
import useForm, { VALIDATORS } from "../../../../../hooks/useForm";
import { Input } from "../../../../misc/inputs/Input";
import { Select } from "../../../../misc/inputs/Select";
import { useState } from "react";

interface Props {
  user: User;
  setUser: (v: User | null) => void;
  loadUsers: () => void;
}
export function EditModal({ user, setUser, loadUsers }: Props) {
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const { fields, handleChange, isValid } = useForm<
    "firstName" | "lastName" | "role"
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
  });

  const roles = [
    { value: ROLE.SUPER_ADMIN, name: ROLE_NAME[ROLE.SUPER_ADMIN] },
    { value: ROLE.ADMIN, name: ROLE_NAME[ROLE.ADMIN] },
    { value: ROLE.AGENT, name: ROLE_NAME[ROLE.AGENT] },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveLoading(true);
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const role = formData.get("role") as unknown as ROLE;

    if (isValid && user._id && user.email) {
      editUser(
        {
          email: user.email,
          firstName,
          lastName,
          role,
        },
        () => {
          setSaveLoading(false);
          loadUsers();
          setUser(null);
        },
        () => {
          setSaveLoading(false);
        }
      );
    }
  };

  return (
    <Modal show={!!user} onClose={() => setUser(null)}>
      <Modal.Header>Edit user</Modal.Header>
      <Modal.Body>
        <form
          id={`EDIT_USER_${user._id}`}
          onSubmit={handleSubmit}
          onChange={handleChange}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-12 sm:col-span-6">
                <div className="flex items-center">
                  {user.verified ? (
                    <>
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                      Verified
                    </>
                  ) : (
                    <>
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                      Not verified
                    </>
                  )}
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6">
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
                  required
                  defaultValue={user.email}
                  disabled
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
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
              <div className="col-span-6 sm:col-span-3">
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
              <div className="col-span-6 sm:col-span-3">
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
          form={`EDIT_USER_${user._id}`}
        >
          Save
        </Button>
        <Button
          disabled={saveLoading}
          color={"light"}
          onClick={() => setUser(null)}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
