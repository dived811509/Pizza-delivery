import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// ✅ Helper: reverse geocoding
async function getAddress({ latitude, longitude }) {
  const res = await fetch(
    `https://geocode.xyz/${latitude},${longitude}?geoit=json`
  );
  if (!res.ok) throw new Error("Failed to fetch address");
  return await res.json();
}

// ✅ Helper: get current position
function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// ✅ Thunk: fetch address
export const fetchAddress = createAsyncThunk(
  "user/fetchAddress",
  async function () {
    // 1) Get geolocation
    const positionObj = await getPosition();
    const position = {
      latitude: positionObj.coords.latitude,
      longitude: positionObj.coords.longitude,
    };

    // 2) Reverse geocoding
    const addressObj = await getAddress(position);

    // Safely build address string
    const address = `${addressObj?.staddress || ""} ${addressObj?.stnumber || ""}, 
      ${addressObj?.city || ""} ${addressObj?.postal || ""}, 
      ${addressObj?.country || ""}`.trim();

    // 3) Return data
    return { position, address };
  }
);

// ✅ Initial state
const initialState = {
  username: "",
  status: "idle", // idle | loading | error
  position: {},
  address: "",
  error: "",
};

// ✅ Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.status = "idle";
        state.position = action.payload.position;
        state.address = action.payload.address;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.status = "error";
        state.error =
          action.error?.message ||
          "There was a problem getting your address. Please fill this field manually.";
      });
  },
});

export const { updateName } = userSlice.actions;
export default userSlice.reducer;
