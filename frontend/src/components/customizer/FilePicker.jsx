import CustomButton from "./CustomButton";

const FilePicker = ({
  file,
  setFile,
  readFile,
  selectedTexture,
  setSelectedTexture,
}) => {
  const handleChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile);
  };
  const handleLogoClick = () => {
    const texture = file;
    readFile("logo", texture);
  };

  const handleFullClick = () => {
    const texture = file;
    readFile("full", texture);
  };

  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Upload File
        </label>

        <p className="mt-2 text-gray-500 text-xs truncate">
          {file === "" ? "No file selected" : file.name}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={handleLogoClick}
          customStyles="text-xs"
        />
        <CustomButton
          type="filled"
          title="Full"
          handleClick={handleFullClick}
          customStyles="text-xs"
        />
      </div>
    </div>
  );
};

export default FilePicker;
