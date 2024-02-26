import axios from "axios";

export const classNames = (...classes: string[]): string => {
  return classes.filter(Boolean).join(" ");
};

export const upload = async (image: File) => {
  return await axios
    .post<string>(
      `${process.env.REACT_APP_API_URL}/storage/upload`,
      {
        image,
      },
      {
        headers: {
          "content-type": "multipart/form-data; ",
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => err);
};
