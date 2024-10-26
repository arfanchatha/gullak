import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import MemberArea from "./pages/MemberArea";

import PageNotFound from "./pages/PageNotFound";
import { Toaster } from "react-hot-toast";
import GlobalContextProvider from "./components/GlobalContextProvider";
import AdminArea from "./pages/AdminArea";
import Hero from "./pages/Hero";
import AppLayout from "./UI/AppLayout";
import Dashboard from "./pages/AdminArea/Dashboard";
import Commetti from "./pages/AdminArea/Commetti";
import Transactions from "./pages/AdminArea/Transactions";
import Members from "./pages/AdminArea/Members";
import Assistant from "./pages/AdminArea/Assistant";
import CommettiDetails from "./pages/AdminArea/CommettiDetails";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Hero />} />
              <Route path="/adminarea" element={<AdminArea />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="commetti" element={<Commetti />}></Route>
                <Route
                  path="commetti/commettidetails/:id"
                  element={<CommettiDetails />}
                />
                <Route path="transactions" element={<Transactions />} />
                <Route path="members" element={<Members />} />
                <Route path="assistant" element={<Assistant />} />
              </Route>
              <Route path="/memberarea" element={<MemberArea />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </GlobalContextProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          className: "bg-gray-0 text-gray-700",
          duration: 5000,
          style: {
            fontSize: "16px",
            maxWidth: "500px",
          },

          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
