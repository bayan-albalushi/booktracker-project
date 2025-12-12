import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ===============================
// MOCK AXIOS
// ===============================
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// ===============================
// MOCK REDUX
// ===============================
jest.mock("react-redux", () => ({
  useSelector: () => ({
    user: {
      _id: "1",
      userName: "Test User",
      userEmail: "test@test.com",
    },
  }),
  useDispatch: () => jest.fn(),
}));

import AboutBooks from "../components/AboutBooks";
import UserHome from "../components/UserHome";
import Settings from "../components/Settings";
import NearbyBookStores from "../components/NearbyBookStores";

// ===============================
// TESTS (4 REQUIRED ✔)
// ===============================

test("About Books page shows title", async () => {
  const axios = require("axios");
  axios.get.mockResolvedValueOnce({
    data: { books: [] },
  });

  render(
    <MemoryRouter>
      <AboutBooks />
    </MemoryRouter>
  );

  expect(await screen.findByText(/about books/i)).toBeInTheDocument();
});

test("User Home page shows Welcome text", () => {
  render(
    <MemoryRouter>
      <UserHome />
    </MemoryRouter>
  );

  expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
});

test("Settings page shows Save Settings button", () => {
  render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>
  );

  expect(screen.getByText(/save settings/i)).toBeInTheDocument();
});

test("Nearby Book Stores page renders", () => {
  render(
    <MemoryRouter>
      <NearbyBookStores />
    </MemoryRouter>
  );

  expect(screen.getByText(/book stores/i)).toBeInTheDocument();
});
