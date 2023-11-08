import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import state from "../storeProxy";
import { reader } from "../config/helper";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import { ColorPicker, CustomButton, FilePicker, Tab } from "../customizer";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Three from "../Three";
import { addItemToCart } from "../../actions/cartActions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Customizer = ({ setSelectedTexture, selectedTexture }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  console.log("productssss", products);

  const snap = useSnapshot(state);

  const [file, setFile] = useState("");

  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    console.log("PRODUCT HANDLE", product);
  };

  const handleCart = () => {
    if (selectedProduct) {
      dispatch(addItemToCart(selectedProduct._id, 1)); // Assuming you want to add 1 quantity
      toast.success("Item Added to Cart");
    } else {
      toast.error("Please select a product first.");
    }
  };

  const handleTexture = (texture) => {
    setSelectedTexture(texture);
  };

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return (
          <FilePicker
            file={file}
            setFile={setFile}
            readFile={readFile}
            selectedTexture={selectedTexture}
            setSelectedTexture={setSelectedTexture}
          />
        );
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);

      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];

    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      <ToastContainer />
      {!snap.intro && (
        <>
          {/* <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}

                {generateTabContent()}
              </div>
            </div>
          </motion.div> */}

          <motion.div
            className="absolute z-12 inset-y-1/2 right-12"
            {...fadeAnimation}
          >
            <div className="flex flex-col items-center gap-3 ">
              <h3 className="font-bold">Textures</h3>
              <div className="grid grid-cols-2  items-center justify-center mx-auto gap-6">
                {products
                  .filter(
                    (category) =>
                      category.category === "64cc6852182d28d94bdfc28a"
                  )
                  .map((product) => (
                    <>
                      <img
                        key={product._id}
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-12 h-12 cursor-pointer rounded-full" // Add cursor-pointer class to make it clear it's clickable
                        onClick={() => {
                          handleProductSelect(product);
                          handleTexture(product.images[0].url); // Change the skin of the selected product
                        }} // Call the handleProductClick function on click
                      />
                    </>
                  ))}
              </div>
            </div>

            <button
              className="bg-[#4F46E5] hover:bg-[#4540a6] text-white rounded py-3 px-6 my-6 cursor-pointer"
              onClick={() => {
                if (selectedProduct && selectedProduct.stock > 0) {
                  handleCart();
                } else if (!selectedProduct) {
                  toast.error(
                    "Please select a product before adding it to the cart."
                  );
                } else {
                  toast.error("This product is out of stock.");
                }
              }}
              // disabled={!selectedProduct || selectedProduct.stock === 0}
            >
              Add to Cart
            </button>
          </motion.div>

          <motion.div
            className="absolute z-10 bottom-5 right-0 left-0 w-full flex justify-center items-center flex-wrap gap-4"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
