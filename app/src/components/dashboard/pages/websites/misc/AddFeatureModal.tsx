import { Button, Modal } from "flowbite-react";
import useForm from "../../../../../hooks/useForm";
import { FEATURE, FEATURE_NAME, Feature } from "../../../../../@types/feature";
import { VALIDATORS } from "../../../../../hooks/useForm";
import { useState } from "react";
import { Select } from "../../../../misc/inputs/Select";
import { Page } from "../../../../../@types/page";

interface Props {
  page: Page;
  setPage: (v: Page) => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}
export function AddFeatureModal({ isOpen, setIsOpen, page, setPage }: Props) {
  const features = [
    {
      value: FEATURE.CONTENT,
      name: FEATURE_NAME[FEATURE.CONTENT],
      disabled: false,
    },
    {
      value: FEATURE.GALLERY,
      name: FEATURE_NAME[FEATURE.GALLERY],
      disabled: false,
    },
    {
      value: FEATURE.LOCATION,
      name: FEATURE_NAME[FEATURE.LOCATION],
      disabled: false,
    },
    {
      value: FEATURE.CONTACT,
      name: FEATURE_NAME[FEATURE.CONTACT],
      disabled: true,
    },
  ];

  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const { isValid, handleChange, fields } = useForm<"feature">({
    feature: {
      value: FEATURE.CONTENT,
      validators: [VALIDATORS.REQUIRED, VALIDATORS.ENUM],
      enum: Object.values(FEATURE),
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveLoading(true);
    const formData = new FormData(event.currentTarget);

    const feature = formData.get("feature") as unknown as FEATURE;

    if (isValid) {
      setPage({ ...page, features: [...page.features, getFeature(feature)] });
      setSaveLoading(false);
      setIsOpen(false);
    }
  };

  const getFeature = (feature: FEATURE): Feature => {
    switch (feature) {
      case FEATURE.CONTENT:
        return {
          name: FEATURE.CONTENT,
          index: page.features.length,
          title: {},
          description: {},
          images: [],
        };
      case FEATURE.CONTACT:
        return {
          name: FEATURE.CONTACT,
          index: page.features.length,
        };
      case FEATURE.GALLERY:
        return {
          name: FEATURE.GALLERY,
          index: page.features.length,
          images: [],
        };
      case FEATURE.LOCATION:
        return {
          name: FEATURE.LOCATION,
          index: page.features.length,
        };
      default:
        return {
          name: feature,
          index: page.features.length,
        };
    }
  };

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Header>Add feature</Modal.Header>
      <Modal.Body>
        <form
          id={`ADD_FEATURE`}
          onSubmit={handleSubmit}
          onChange={handleChange}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-12 sm:col-span-6">
                <label
                  htmlFor="feature"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Select feature
                </label>
                <Select
                  state={fields.feature?.state}
                  errorMessage={fields.feature?.errorMessage}
                  id="feature"
                  name="feature"
                  defaultValue={FEATURE.CONTENT}
                  options={features}
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
          form={`ADD_FEATURE`}
        >
          Add
        </Button>
        <Button
          disabled={saveLoading}
          color={"light"}
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
