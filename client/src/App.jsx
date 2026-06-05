import { Outlet } from "react-router-dom";
import Footer from "./components/common/Footer";
import Header from "./components/common/navbar/Header";
import ChatWidget from "./components/common/ChatWidget";
import { useGetProfile } from "./hooks/user.query";
import DemoNav from "./components/common/navbar/DemoNav";

function App() {
  // const { data } = useGetProfile();
  // console.log(data);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <DemoNav/>
      {/* <Header /> */}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Global Floating Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
