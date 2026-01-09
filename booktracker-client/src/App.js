import "bootstrap/dist/css/bootstrap.css";
import * as Reactstrap from "reactstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";

// AUTH
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPw from "./components/ForgotPw";
import Footer from "./components/Footer";

// ADMIN
import AdminDashboard from "./components/AdminDashboard";
import ManageBooks from "./components/ManageBooks";
import RequestsPage from "./components/RequestsPage";
import AdminSettings from "./components/AdminSettings";

// USER
import UserHome from "./components/UserHome";
import UserProfile from "./components/UserProfile";
import AboutBooks from "./components/AboutBooks";
import BookDetails from "./components/BookDetails";
import PdfViewer from "./components/PdfViewer";
import MyFavorites from "./components/MyFavorites";
import NearbyBookStores from "./components/NearbyBookStores";
import Settings from "./components/Settings";
import StoreMap from "./components/StoreMap";

function App() {
  return (
    <Provider store={store}>
      <Reactstrap.Container fluid className="vh-100">
        <BrowserRouter>
          <Reactstrap.Row className="p-3">
            <Routes>
              {/* AUTH */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotPassword" element={<ForgotPw />} />

              {/* ADMIN */}
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/manageBooks" element={<ManageBooks />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              {/* USER (PROTECTED) */}
                <Route path="/user/home" element={<UserHome />} />
                <Route path="/user/aboutBooks" element={<AboutBooks />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/user/favorites" element={<MyFavorites />} />
                <Route
                  path="/user/nearbyBookStores"
                  element={<NearbyBookStores />}
                />
                <Route path="/user/settings" element={<Settings />} />

                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/pdf/:id" element={<PdfViewer />} />
                <Route path="/store-map" element={<StoreMap />} />
              </Route>
            </Routes>
          </Reactstrap.Row>

          <Reactstrap.Row>
            <Footer />
          </Reactstrap.Row>
        </BrowserRouter>
      </Reactstrap.Container>
    </Provider>
  );
}

export default App;
