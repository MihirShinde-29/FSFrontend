import React, { useState } from "react";
import { BsFillInfoCircleFill, BsFillStarFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import {
  useDeleteItemMutation,
  useEditItemMutation,
} from "../features/item/itemApiSlice";
import { setStatus } from "../features/item/itemSlice";
import Modal from "react-modal";
import { toast } from "react-toastify";

const ItemCard = ({ item }) => {
  const dispatch = useDispatch();
  const [deleteItem, { isLoading }] = useDeleteItemMutation();
  const [editItem, { isLoading: updating }] = useEditItemMutation();
  const { createdAt, link, updatedAt, __v, ...rest } = item;
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState(null);
  const [newItem, setNewItem] = useState(rest);
  const deleteItemFunc = async () => {
    await deleteItem(item._id);
    dispatch(setStatus("fetch"));
    toast.success("Item Deleted Successfully");
  };
  const updateItemFunc = async () => {
    const updated = new FormData()
    updated.append("name", newItem.name);
    updated.append("description", newItem.description);
    updated.append("price", newItem.price);
    updated.append("discount", newItem.discount);
    updated.append("rating", newItem.rating);
    updated.append("sponsored", newItem.sponsored);
    image && updated.append("image", image);
    console.log(updated);
    await editItem({ id: item._id, updated });
    dispatch(setStatus("fetch"));
    setNewItem({ ...newItem });
    setModal(false);
    toast.success("Item Updated Successfully");
  };
  const closeModal = () => {
    setNewItem({ ...rest });
    setModal(false);
  };
  return (
    <div className="bg-white p-4 rounded relative shadow-lg">
      <img
        src={"https://fsbackend-production.up.railway.app" + item.link}
        alt=""
        className="h-48 mx-auto"
      />
      {item.sponsored && (
        <div className="flex gap-2 items-center text-gray-400 text-xs font-semibold absolute top-48 left-2">
          Sponsored <BsFillInfoCircleFill />
        </div>
      )}
      {item.discount && (
        <div className="flex flex-col items-center px-4 py-2 rounded-lg text-sm bg-blue-500 text-gray-100 font-semibold absolute top-2 left-2">
          <h1>{item.discount}%</h1>
          <h1>OFF</h1>
        </div>
      )}
      <h1 className="mt-2 truncate" title={item.description}>
        {item.description}
      </h1>
      <h1 className="text-blue-500 text-sm">{item.name}</h1>
      <div className="flex items-center gap-2">
        <h1 className="font-semibold text-lg">
          R {parseFloat(item.price - (item.price * item.discount) / 100).toFixed(2)}
        </h1>
        <h1 className="text-gray-400 text-sm line-through">R {item.price}</h1>
        <BsFillInfoCircleFill className="text-gray-400 text-xs" />
      </div>
      <div className="flex items-center gap-2">
        <BsFillStarFill className="text-amber-400" />
        <h1>{item.rating}</h1>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={() => setModal(true)}
          className="bg-blue-500 text-gray-100 px-4 py-2 rounded-lg font-semibold"
        >
          Update
        </button>
        <button
          onClick={() => deleteItemFunc()}
          disabled={isLoading}
          className="bg-red-500 text-gray-100 px-4 py-2 rounded-lg font-semibold"
        >
          {isLoading ? "Deleting" : "Delete"}
        </button>
      </div>
      <Modal
        isOpen={modal}
        onRequestClose={() => closeModal()}
        contentLabel="Update Item"
        className="bg-gray-100 w-1/2 p-4 rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 duration-100"
      >
        <div className="">
          <h1 className="text-4xl font-semibold">Update Item</h1>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-gray-600">Name</h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-gray-600">
                Rating - {newItem.rating}
              </h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                value={newItem.rating * 10}
                onChange={(e) =>
                  setNewItem({ ...newItem, rating: e.target.value / 10 })
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
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-gray-600">Price</h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-gray-600">
                Discount - {newItem.discount}%
              </h1>
              <input
                className="focus:outline-none px-4 py-2 rounded"
                value={newItem.discount}
                onChange={(e) =>
                  setNewItem({ ...newItem, discount: e.target.value })
                }
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
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="flex gap-2 col-span-2">
              <input
                checked={newItem.sponsored}
                onChange={(e) =>
                  setNewItem({ ...newItem, sponsored: !newItem.sponsored })
                }
                type="checkbox"
              />
              <h1 className="text-gray-600">Sponsored</h1>
            </div>
            <div className="flex justify-between col-span-2">
              <button
                className="bg-blue-500 text-gray-100 px-4 py-2 rounded-lg font-semibold"
                disabled={updating}
                onClick={() => updateItemFunc()}
              >
                {updating ? "Updating" : "Update"}
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
};

export default ItemCard;
