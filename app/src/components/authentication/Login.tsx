import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "flowbite-react";
import useForm, { VALIDATORS } from "../../hooks/useForm";
import { Input } from "../misc/inputs/Input";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signin, loading, getUserInfo, errored } = useAuth();
  const { fields, handleChange, isValid } = useForm<"email" | "password">({
    email: {
      value: "",
      validators: [VALIDATORS.REQUIRED, VALIDATORS.EMAIL],
    },
    password: {
      value: "",
      validators: [VALIDATORS.REQUIRED],
    },
  });
  const [displayToast, setDisplayToast] = useState<boolean>(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (isValid) {
      signin({ email, password }, () => {
        getUserInfo();
        setDisplayToast(false);
        navigate(from, { replace: true });
      });
    }
  };

  useEffect(() => {
    if (displayToast) {
      setTimeout(() => {
        setDisplayToast(false);
      }, 5000);
    }
  }, [displayToast]);

  useEffect(() => {
    if (errored) {
      setDisplayToast(true);
    }
  }, [errored]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {displayToast ? (
        <div
          id="toast-danger"
          className="absolute top-6 right-6 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
            <XMarkIcon className="w-5 h-5" />

            <span className="sr-only">Error icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">
            Wrong credentials, please try again.
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
            data-dismiss-target="#toast-danger"
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

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          onChange={handleChange}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <Input
                state={fields.email?.state}
                errorMessage={fields.email?.errorMessage}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <Link
                to="forgot-password"
                className="font-semibold text-indigo-600 hover:text-indigo-500 text-sm"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-2">
              <Input
                state={fields.password?.state}
                errorMessage={fields.password?.errorMessage}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              isProcessing={loading}
              disabled={!isValid || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

Login.displayName = "Login";
