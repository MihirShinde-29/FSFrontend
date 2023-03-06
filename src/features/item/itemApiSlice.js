import { apiSlice } from "../../app/api/apiSlice";

const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => "/api/items",
    }),
    addItem: builder.mutation({
      query: (newItem) => ({
        url: "/api/items",
        method: "POST",
        body: newItem,
      }),
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/api/items/${id}`,
        method: "DELETE",
      }),
    }),
    editItem: builder.mutation({
      query: ({ id, updated }) => ({
        url: `/api/items/${id}`,
        method: "PUT",
        body: updated,
      }),
    }),
  }),
});

export const {
  useLazyGetItemsQuery,
  useAddItemMutation,
  useDeleteItemMutation,
  useEditItemMutation,
} = itemApiSlice;
