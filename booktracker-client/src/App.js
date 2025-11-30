import "bootstrap/dist/css/bootstrap.css";
import * as Reactstrap from "reactstrap";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "./store/store";

// components
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import ManageBooks from "./components/ManageBooks";
import UserProfile from "./components/UserProfile";
import RequestsPage from "./components/RequestsPage";
import Footer from "./components/Footer";
import UserHome from "./components/UserHome";
import ForgotPw from "./components/ForgotPw";
import AboutBooks from "./components/AboutBooks";
import BookDetails from "./components/BookDetails";
import PdfViewer from "./components/PdfViewer";
import MyFavorites from "./components/MyFavorites";


function App() {
  return (
    <>
      <Provider store={store}>
        <Reactstrap.Container fluid className="vh-100">
          <BrowserRouter>
            <Reactstrap.Row className="p-3">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgotPassword" element={<ForgotPw />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/manageBooks" element={<ManageBooks />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/requests" element={<RequestsPage />} />
                <Route path="/user/home" element={<UserHome />} />
                <Route path="/user/aboutBooks" element={<AboutBooks />} />
                <Route path="/books" element={<AboutBooks />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/pdf/:id" element={<PdfViewer />} />
                <Route path="/user/favorites" element={<MyFavorites />} />

              </Routes>
            </Reactstrap.Row>

            <Reactstrap.Row>
              <Footer />
            </Reactstrap.Row>
          </BrowserRouter>
        </Reactstrap.Container>
      </Provider>
    </>
  );
}

export default App;
