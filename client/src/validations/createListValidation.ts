import * as Yup from "yup";

const createListValidation = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  tags: Yup.array().of(Yup.string()).required("At least one tag is required"),
  visibility: Yup.string()
    .oneOf(["private", "friends", "public"])
    .required("Visibility is required"),
  coverImage: Yup.mixed().required("Cover image is required"),
});

export default createListValidation;
