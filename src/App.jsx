import React, { useEffect, useState } from "react";
import { useAddItemMutation, useLazyGetItemsQuery } from "./features/item/itemApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setItems, setStatus } from "./features/item/itemSlice";
import ItemCard from "./components/ItemCard";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.item);
  const [getItems, { data, error, isLoading }] = useLazyGetItemsQuery();
  const [addItem, { isLoading: adding }] = useAddItemMutation();
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    rating: "",
    sponsored: false,
    image: null,
  });
  useEffect(() => {
    getItems();
  }, []);
  useEffect(() => {
    if (status === "fetch") {
      getItems();
    }
  }, [status]);
  useEffect(() => {
    if (data) {
      dispatch(setStatus("idle"));
      dispatch(setItems(data));
    }
  }, [data]);
  const closeModal = () => {
    setItem({
      name: "",
      description: "",
      price: "",
      discount: "",
      rating: "",
      sponsored: false,
      image: null,
    });
    setModal(false);
  };
  const updateItemFunc = async () => {
    const newItem = new FormData();
    newItem.append("name", item.name);
    newItem.append("description", item.description);
    newItem.append("price", item.price);
    newItem.append("discount", item.discount);
    newItem.append("rating", item.rating);
    newItem.append("sponsored", item.sponsored);
    newItem.append("image", item.image);
    await addItem(newItem);
    dispatch(setStatus("fetch"));
    setItem({
      name: "",
      description: "",
      price: "",
      discount: "0",
      rating: "0",
      sponsored: false,
      image: null,
    });
    setModal(false);
    toast.success("Item Added Successfully");
  };
  return (
    <div className="min-h-screen px-12 sm:px-16 lg:px-36 py-8 bg-gray-200">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold">Items</h1>
        <button
          onClick={() => setModal(true)}
          className="bg-blue-500 text-gray-100 px-4 py-2 rounded-lg font-semibold"
        >
          Add Item
        </button>
      </div>
      {isLoading && <div>Loading...</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {items && items.map((item) => <ItemCard key={item._id} item={item} />)}
      </div>
      <Modal
        isOpen={modal}
        onRequestClose={() => closeModal()}
        contentLabel="Update Item"
        className="bg-gray-100 w-1/2 p-4 rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 duration-100"
      >
        <div className="">
          <h1 className="text-4xl font-semibold">Add Item</h1>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-gray-600">Name</h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                value={item.name}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-gray-600">Rating - {item.rating}</h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                value={item.rating * 10}
                onChange={(e) =>
                  setItem({ ...item, rating: e.target.value / 10 })
                }
                type="range"
                min="0"
                max="50"
              />
            </div>
            <div className="flex flex-col col-span-2 gap-2">
              <h1 className="text-xl text-gray-600">Description</h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                value={item.description}
                onChange={(e) =>
                  setItem({ ...item, description: e.target.value })
                }
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-gray-600">Price</h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                value={item.price}
                onChange={(e) => setItem({ ...item, price: e.target.value })}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-gray-600">
                Discount - {item.discount}%
              </h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                value={item.discount}
                onChange={(e) => setItem({ ...item, discount: e.target.value })}
                type="range"
                min="0"
                max="100"
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <h1 className="text-xl text-gray-600">New Image</h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                type="file"
                onChange={(e) => setItem({ ...item, image: e.target.files[0] })}
              />
            </div>
            <div className="flex gap-2 col-span-2">
              <input
                checked={item.sponsored}
                onChange={(e) =>
                  setItem({ ...item, sponsored: !item.sponsored })
                }
                type="checkbox"
              />
              <h1 className="text-gray-600">Sponsored</h1>
            </div>
            <div className="flex justify-between col-span-2">
              <button
                className="bg-blue-500 text-gray-100 px-4 py-2 rounded-lg font-semibold"
                disabled={adding}
                onClick={() => updateItemFunc()}
              >
                {adding ? "Adding" : "Add"}
              </button>
              <button
                className="bg-red-500 text-gray-100 px-4 py-2 rounded-lg font-semibold"
                onClick={() => closeModal()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
