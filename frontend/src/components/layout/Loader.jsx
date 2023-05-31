import "/loader.css";

const Loader = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: `calc(100vh - 160px)` }}
    >
      <div className="loader">
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
      </div>
    </div>
  );
};

export default Loader;
