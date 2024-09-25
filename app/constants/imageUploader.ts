
type ImageUploaderProps<T> = {
    setImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
    setImageUploadErrorMsg?: (value: React.SetStateAction<string | boolean>) => void;
    e: React.ChangeEvent<HTMLInputElement>;
    updateFormValues: (value: React.SetStateAction<T | undefined>) => void;
    formValues: T | undefined;
}

/**
 * Function to handle image file upload and update form values
 * @param e is the event handler
 * @returns void
 */
export const handleFileUpload = <T>({e, setImageUploadErrorMsg, updateFormValues, formValues, setImageUrl}: ImageUploaderProps<T>) => {
  if (!e.target.files) return;

  // Get the selected file
  const selectedFile: File = e.target.files[0];

  // If a valid file was selected...
  if (
    selectedFile.type === "image/jpg" ||
    selectedFile.type === "image/png" ||
    selectedFile.type === "image/jpeg" ||
    selectedFile.type === "image/webp"
  ) {
    // Unset validation message
    setImageUploadErrorMsg && setImageUploadErrorMsg(false);

    const file = e.target.files[0]; // Get the selected file

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64URL: string = e.target?.result as string; // This is the base64 URL of the image

        if (base64URL) {
          // Extract only the base64 string (remove "data:image/jpeg;base64," prefix)
          const base64String = base64URL.split(",")[1];

          // Update form values
          updateFormValues({
            ...(formValues as T),
            imageBase64Url: base64String,
          });
        }
      };

      // Read the file as a data URL (base64-encoded)
      reader.readAsDataURL(file);
    }
  }
  // Otherwise...
  else {
    // Set appropriate validation message
    setImageUploadErrorMsg &&
      setImageUploadErrorMsg("Please select a valid photo");

    // Exit this method
    return;
  }

  // Set the image url
  const imgURL = URL.createObjectURL(selectedFile);

  // Update the image url state
  setImageUrl(imgURL);
};
